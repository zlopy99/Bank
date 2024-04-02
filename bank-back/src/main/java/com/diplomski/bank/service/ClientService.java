package com.diplomski.bank.service;

import com.diplomski.bank.model.*;
import com.diplomski.bank.model.dto.*;
import com.diplomski.bank.repository.*;
import com.diplomski.bank.util.ClientStatusEnum;
import com.diplomski.bank.util.ClientUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.data.crossstore.ChangeSetPersister;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class ClientService {
    private final ClientRepository clientRepository;
    private final ClientDetailRepository clientDetailRepository;
    private final CityRepository cityRepository;
    private final CountryRepository countryRepository;
    private final ModelMapper modelMapper;
    private final RedisDataLoader redis;
    private final AccountRepository accountRepository;
    public static final String CLIENT_DOES_NOT_EXIST = "Client with that ID does not exist";

    public List<ClientDto> getClients(String value) {
        return switch (value.length()) {
            case 9 -> getClientByPersonalDocId(value);
            case 12, 13 -> getClientByJmbg(value);
            default -> getByIdOrClientName(value);
        };
    }

    private List<ClientDto> getClientByPersonalDocId(String value) {
        try {
            return mapAndReturn(clientRepository.findClientByPersonalDocId(value));
        } catch (Exception e) {
            log.error("Exception when finding client by personal document id, " + e.getMessage());
            return Collections.emptyList();
        }
    }

    private List<ClientDto> getClientByJmbg(String value) {
        try {
            return mapAndReturn(clientRepository.findClientByJmbg(value));
        } catch (Exception e) {
            log.error("Exception when finding client by JMBG, " + e.getMessage());
            return Collections.emptyList();
        }
    }

    private List<ClientDto> getByIdOrClientName(String value) {
        if (value.matches("\\d+")) {
            try {
                Long valueLong = Long.valueOf(value);
                return mapAndReturn(clientRepository.findClientById(valueLong));
            } catch (Exception e) {
                log.error("Exception when finding client by client ID, " + e.getMessage());
                return Collections.emptyList();
            }
        } else {
            try {
                return mapAndReturn(clientRepository.findClientsByNameOrLastNameUsingLike(value));
            } catch (Exception e) {
                log.error("Exception when finding client by name, " + e.getMessage());
                return Collections.emptyList();
            }
        }
    }

    private List<ClientDto> mapAndReturn(List<Client> clientList) {
        if (clientList.isEmpty()) return Collections.emptyList();

        return clientList.stream()
                .map(src -> modelMapper.map(src, ClientDto.class))
                .toList();
    }

    public ResponseDto<SaveClientDto> openClient(SaveClientDto saveClientDto) {
        ResponseDto<SaveClientDto> responseDto = new ResponseDto<>();
        try {
            Client client = saveClient(saveClientDto);

            redis.lastFiveClientsAndAccountsDropAndFill();
            responseDto.setClientId(client.getId());

        } catch (Exception e) {
            log.error("Exception when opening new client, " + e.getMessage());
            responseDto.setErrorMessage(e.getMessage());
        }
        return responseDto;
    }

    private City saveCity(SaveClientDto saveClientDto) throws ChangeSetPersister.NotFoundException {
        if (saveClientDto.getCityId() != null) {
            return cityRepository.findById(saveClientDto.getCityId()).orElseThrow(ChangeSetPersister.NotFoundException::new);
        }
        City city = new City();
        city.setName(saveClientDto.getCity());
        Country country = countryRepository.findById(saveClientDto.getCountryId()).orElseThrow(ChangeSetPersister.NotFoundException::new);
        city.setCountryCity(country);
        return cityRepository.save(city);
    }

    private ClientDetail saveClientDetails(SaveClientDto saveClientDto) throws ChangeSetPersister.NotFoundException {
        ClientDetail clientDetail = new ClientDetail();
        City city = saveCity(saveClientDto);

        modelMapper.map(saveClientDto, clientDetail);
        clientDetail.setCityClientDetails(city);
        return clientDetailRepository.save(clientDetail);
    }

    private Client saveClient(SaveClientDto saveClientDto) throws ChangeSetPersister.NotFoundException {
        Client client = new Client();
        ClientDetail clientDetail = saveClientDetails(saveClientDto);
        LocalDate currentLocalDate = ClientUtil.getCurrentLocalDate();

        modelMapper.map(saveClientDto, client);
        client.setOpeningDate(currentLocalDate);
        client.setClientDetail(clientDetail);
        client.setStatus('A');
        return clientRepository.save(client);
    }

    public ResponseDto<SaveClientDto> getClientDetails(Long value) {
        ResponseDto<SaveClientDto> responseDto = new ResponseDto<>();
        SaveClientDto clientDetails = new SaveClientDto();

        try {
            List<Client> clientById = clientRepository.findClientById(value);

            if (clientById.isEmpty()) {
                responseDto.setErrorMessage(CLIENT_DOES_NOT_EXIST);
                return responseDto;
            }

            modelMapper.map(clientById.get(0), clientDetails);
            modelMapper.map(clientById.get(0).getClientDetail(), clientDetails);
            clientDetails.setOpenAccountDtoList(getMappedAccounts(clientById.get(0).getAccounts()));

            responseDto.setObject(clientDetails);
            responseDto.setClientId(value);

        } catch (Exception e) {
            log.error("Exception when retriving client details, " + e.getMessage());
        }

        return responseDto;
    }

    private List<AccountClientTypeDetailDto> getMappedAccounts(List<Account> accounts) {
        return accounts.stream()
                .map(src -> modelMapper.map(src, AccountClientTypeDetailDto.class))
                .toList();
    }

    public ResponseDto<String> editClient(SaveClientDto saveClientDto, Long clientId) {
        ResponseDto<String> responseDto = new ResponseDto<>();

        try {
            LocalDate currentLocalDate = ClientUtil.getCurrentLocalDate();
            List<Client> clientList = clientRepository.findClientById(clientId);
            Client client = clientList.get(0);

            client.setEditDate(currentLocalDate);
            modelMapper.map(saveClientDto, client);
            modelMapper.map(saveClientDto, client.getClientDetail());
            City city = saveCity(saveClientDto);
            client.getClientDetail().setCityClientDetails(city);

            clientRepository.save(client);
            redis.lastFiveClientsAndAccountsDropAndFill();
            responseDto.setClientId(clientId);

        } catch (Exception e) {
            log.error("Exception when editing client, " + e.getMessage());
            responseDto.setErrorMessage(e.getMessage());
        }

        return responseDto;
    }

    public ResponseDto<String> deleteClient(Long clientId) {
        ResponseDto<String> responseDto = new ResponseDto<>();

        try {
            LocalDate currentLocalDate = ClientUtil.getCurrentLocalDate();
            List<Client> clientById = clientRepository.findClientById(clientId);
            clientById.get(0).setStatus(ClientStatusEnum.CLOSED.getShortFlag());
            clientById.get(0).setClosingDate(currentLocalDate);
            ifClientIsClosingCloseAllHisAccounts(clientId, currentLocalDate);

            Client save = clientRepository.save(clientById.get(0));
            redis.lastFiveClientsAndAccountsDropAndFill();
            responseDto.setClientId(save.getId());

        } catch (Exception e) {
            log.error("Exception when closing client, " + e.getMessage());
            responseDto.setErrorMessage(e.getMessage());
        }

        return responseDto;
    }

    private void ifClientIsClosingCloseAllHisAccounts(Long clientId, LocalDate currentLocalDate) {
        List<Account> accountByClientId = accountRepository.findAccountByClientId(clientId);

        for (Account account: accountByClientId) {
            account.setStatus(ClientStatusEnum.CLOSED.getShortFlag());
            account.setClosingDate(currentLocalDate);
        }

        accountRepository.saveAll(accountByClientId);
    }

    public ResponseDto<String> reopenClient(ClientDto clientDto) {
        ResponseDto<String> responseDto = new ResponseDto<>();

        try {
            LocalDate currentLocalDate = ClientUtil.getCurrentLocalDate();
            List<Client> clientById = clientRepository.findClientById(clientDto.getId());
            clientById.get(0).setStatus(ClientStatusEnum.ACTIVE.getShortFlag());
            clientById.get(0).setClosingDate(null);
            clientById.get(0).setEditDate(currentLocalDate);

            Client save = clientRepository.save(clientById.get(0));
            redis.lastFiveClientsAndAccountsDropAndFill();
            responseDto.setClientId(save.getId());

        } catch (Exception e) {
            log.error("Exception when reopening client, " + e.getMessage());
            responseDto.setErrorMessage(e.getMessage());
        }

        return responseDto;
    }
}

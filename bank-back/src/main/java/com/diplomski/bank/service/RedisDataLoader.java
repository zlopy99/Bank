package com.diplomski.bank.service;

import com.diplomski.bank.model.*;
import com.diplomski.bank.model.dto.*;
import com.diplomski.bank.repository.AccountRepository;
import com.diplomski.bank.repository.CityRepository;
import com.diplomski.bank.repository.ClientRepository;
import com.diplomski.bank.repository.CountryRepository;
import com.diplomski.bank.util.ClientStatusEnum;
import com.diplomski.bank.util.ClientUtil;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.data.redis.core.RedisCallback;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;

import java.util.*;

@Component
@RequiredArgsConstructor
public class RedisDataLoader implements ApplicationRunner {
    private final RedisTemplate<String, Object> redisTemplate;
    private final ClientRepository clientRepository;
    private final AccountRepository accountRepository;
    private final CountryRepository countryRepository;
    private final CityRepository cityRepository;
    private final ModelMapper modelMapper;

    @Override
    public void run(ApplicationArguments args) {
        flushAllFromMyRedisDb();
        lastFiveClientsAndAccounts();
        fillRedisWithCountries();
        fillRedisWithCities();
        getAndSetOpenedAccountsInAMonth();
        getAndSetOpenedAndClosedClientsInAWeek();
        getAndSetOpenedAndClosedClientsInAYear();
    }

    private void flushAllFromMyRedisDb() {
        redisTemplate.execute((RedisCallback<Object>) connection -> {
            connection.serverCommands().flushDb();
            return null;
        });
    }

    protected void lastFiveClientsAndAccountsDropAndFill() {
        for (int i = 0; i < 5; i++) {
            redisTemplate.delete("last_five_clients_" + i);
            redisTemplate.delete("last_five_accounts_" + i);
        }
        lastFiveClientsAndAccounts();
    }

    protected void lastFiveClientsAndAccounts() {
        List<Client> lastFiveOpenClients = clientRepository.getLastFiveOpenClients();
        List<Account> lastFiveOpenAccounts = accountRepository.getLastFiveOpenAccounts();

        if (!lastFiveOpenClients.isEmpty() && lastFiveOpenClients.size() >= 5)
            for (int i = 0; i < 5; i++) {
                redisTemplate.opsForValue().set("last_five_clients_" + i, lastFiveOpenClients.get(i));
            }
        if (!lastFiveOpenAccounts.isEmpty() && lastFiveOpenAccounts.size() >= 5)
            for (int i = 0; i < 5; i++) {
                redisTemplate.opsForValue().set("last_five_accounts_" + i, lastFiveOpenAccounts.get(i));
            }
    }

    public ClientAccountDto getFirstFiveClientsAndAccounts() {
        ObjectMapper mapper = new ObjectMapper();
        List<Client> client = new ArrayList<>();
        List<ClientDto> clientDtoList = null;
        List<Account> account = new ArrayList<>();
        List<AccountDto> accountDtoList = null;
        ClientAccountDto clientAccountDto = new ClientAccountDto();

        for (int i = 0; i < 5; i++) {
            client.add(mapper.convertValue(redisTemplate.opsForValue().get("last_five_clients_" + i), Client.class));
            account.add(mapper.convertValue(redisTemplate.opsForValue().get("last_five_accounts_" + i), Account.class));
        }

        if (ClientUtil.checkIfAllElementsInListAreNotNull(client)) {
            clientDtoList = client.stream()
                    .map(src -> modelMapper.map(src, ClientDto.class))
                    .toList();
        }
        if(ClientUtil.checkIfAllElementsInListAreNotNull(account)) {
            accountDtoList = account.stream()
                    .map(src -> modelMapper.map(src, AccountDto.class))
                    .toList();
        }

        clientAccountDto.setClientDto(clientDtoList);
        clientAccountDto.setAccountDto(accountDtoList);

        return clientAccountDto;
    }

    private void fillRedisWithCountries() {
        List<Country> countries = countryRepository.findAll();
        if (!countries.isEmpty())
            for (Country country: countries) {
                redisTemplate.opsForValue().set("country" + "_" + country.getId() + "_" + country.getName().toLowerCase(), country);
            }
    }

    private void fillRedisWithCities() {
        List<City> cities = cityRepository.findAllWhereCountryIsBiH();
        if (!cities.isEmpty())
            for (City city: cities) {
                redisTemplate.opsForValue().set("city" + "_" + city.getId() + "_" + city.getName().toLowerCase(), city);
        }
    }

    public List<CountryDto> getSelectedCountries(String value) {
        Set<String> keys = redisTemplate.keys("country_*" + value + "*");

        if (keys == null || keys.isEmpty())
            return Collections.emptyList();

        List<Object> values = redisTemplate.opsForValue().multiGet(keys);

        if (values == null || values.isEmpty())
            return Collections.emptyList();

        return values.stream()
                .map(src -> modelMapper.map(src, CountryDto.class))
                .toList();
    }

    public List<CityDto> getSelectedCities(String value) {
        Set<String> keys = redisTemplate.keys("city_*" + value + "*");

        if (keys == null || keys.isEmpty())
            return Collections.emptyList();

        List<Object> values = redisTemplate.opsForValue().multiGet(keys);

        if (values == null || values.isEmpty())
            return Collections.emptyList();

        return values.stream()
                .map(src -> modelMapper.map(src, CityDto.class))
                .toList();
    }

    public void getAndSetOpenedAccountsInAMonth() {
        List<Account> allAccountsOfLastMonth = accountRepository.getAllAccountsOfLastMonth();

        if (allAccountsOfLastMonth.isEmpty())
            return;

        for (Account account: allAccountsOfLastMonth) {
            redisTemplate.opsForValue().set("last_month_account_" + account.getId() + "_" + account.getAccountType().getName().toLowerCase(), account.getAccountType());
        }
    }

    public Set<AccountTypeDto> getAllAccountsOpenedLastMonth() {
        Set<String> keys = redisTemplate.keys("*last_month_account_*");

        if (keys == null || keys.isEmpty())
            return Collections.emptySet();

        List<Object> values = redisTemplate.opsForValue().multiGet(keys);

        if (values == null || values.isEmpty())
            return Collections.emptySet();

        List<AccountTypeDto> listAccountTypes = values.stream()
                .map(src -> modelMapper.map(src, AccountTypeDto.class))
                .toList();

        return ClientUtil.calculatePercentage(listAccountTypes);
    }

    public void getAndSetOpenedAndClosedClientsInAWeek() {
        List<Client> allClientsOfLastWeekOpened = clientRepository.getAllClientsOfLastWeekOpened();
        List<Client> allClientsOfLastWeekClosed = clientRepository.getAllClientsOfLastWeekClosed();

        if (allClientsOfLastWeekOpened.isEmpty() && allClientsOfLastWeekClosed.isEmpty())
            return;

        if (!allClientsOfLastWeekOpened.isEmpty()) {
            for (Client client: allClientsOfLastWeekOpened) {
                redisTemplate.opsForValue().set("last_week_client_opened_" + client.getId(), client);
            }
        }
        if (!allClientsOfLastWeekClosed.isEmpty()) {
            for (Client client: allClientsOfLastWeekClosed) {
                redisTemplate.opsForValue().set("last_week_client_closed_" + client.getId(), client);
            }
        }
    }

    public List<ClientsInLastWeekDto> getAllClientsOpenedAndClosedLastWeek() {
        List<Object> valuesOpened = null;
        List<Object> valuesClosed = null;
        List<ClientsInLastWeekDto> lastWeekDtosOpened = new ArrayList<>();
        List<ClientsInLastWeekDto> lastWeekDtosClosed = new ArrayList<>();
        Set<String> keysOpened = redisTemplate.keys("*last_week_client_opened_*");
        Set<String> keysClosed = redisTemplate.keys("*last_week_client_closed_*");

        if ((keysOpened == null || keysOpened.isEmpty()) && (keysClosed == null || keysClosed.isEmpty()))
            return Collections.emptyList();

        if (!(keysOpened == null || keysOpened.isEmpty()))
            valuesOpened = redisTemplate.opsForValue().multiGet(keysOpened);
        if (!(keysClosed == null || keysClosed.isEmpty()))
            valuesClosed = redisTemplate.opsForValue().multiGet(keysClosed);

        if ((valuesOpened == null || valuesOpened.isEmpty()) && (valuesClosed == null || valuesClosed.isEmpty()))
            return Collections.emptyList();

        if (!(valuesOpened == null || valuesOpened.isEmpty()))
            lastWeekDtosOpened = valuesOpened.stream()
                    .map(src -> modelMapper.map(src, ClientsInLastWeekDto.class))
                    .toList();
        if (!(valuesClosed == null || valuesClosed.isEmpty()))
            lastWeekDtosClosed = valuesClosed.stream()
                    .map(src -> modelMapper.map(src, ClientsInLastWeekDto.class))
                    .toList();

        List<ClientsInLastWeekDto> openClientsByDay = ClientUtil.getOpenClientsByDay(lastWeekDtosOpened);
        List<ClientsInLastWeekDto> closeClientsByDay = ClientUtil.getCloseClientsByDay(lastWeekDtosClosed);
        openClientsByDay.addAll(closeClientsByDay);

        return openClientsByDay;
    }

    public void getAndSetOpenedAndClosedClientsInAYear() {
        List<ClientsAccountsCountDto> clientsOpened = Collections.emptyList();
        List<ClientsAccountsCountDto> clientsClosed = Collections.emptyList();
        List<Map<Long, Long>> allClientsYearlyOpened = clientRepository.getAllClientsOpenedInAYear();
        List<Map<Long, Long>> allClientsYearlyClosed = clientRepository.getAllClientsClosedInAYear();

        if (allClientsYearlyOpened.isEmpty() && allClientsYearlyClosed.isEmpty())
            return;

        if (!allClientsYearlyOpened.isEmpty())
            clientsOpened = allClientsYearlyOpened.stream()
                    .map(src -> modelMapper.map(src, ClientsAccountsCountDto.class))
                    .toList();

        if (!allClientsYearlyClosed.isEmpty())
            clientsClosed = allClientsYearlyClosed.stream()
                    .map(src -> modelMapper.map(src, ClientsAccountsCountDto.class))
                    .toList();

        if (!clientsOpened.isEmpty()) {
            for (ClientsAccountsCountDto c : clientsOpened) {
                redisTemplate.opsForValue().set("yearly_opened_clients_" + c.getGroupby(), c);
            }
        }
        if (!clientsClosed.isEmpty()) {
            for (ClientsAccountsCountDto c : clientsClosed) {
                redisTemplate.opsForValue().set("yearly_closed_clients_" + c.getGroupby(), c);
            }
        }
    }

    public List<ClientsAccountsCountDto> getAllOpenedAndClosedClientsYearly() {
        List<Object> valuesOpened = null;
        List<Object> valuesClosed = null;
        List<ClientsAccountsCountDto> yearlyOpenedClients = new ArrayList<>();
        List<ClientsAccountsCountDto> yearlyClosedClients = new ArrayList<>();
        List<ClientsAccountsCountDto> finalList = new ArrayList<>();
        Set<String> keysOpened = redisTemplate.keys("*yearly_opened_clients_*");
        Set<String> keysClosed = redisTemplate.keys("*yearly_closed_clients_*");

        if ((keysOpened == null || keysOpened.isEmpty()) && (keysClosed == null || keysClosed.isEmpty()))
            return Collections.emptyList();

        if (!(keysOpened == null || keysOpened.isEmpty()))
            valuesOpened = redisTemplate.opsForValue().multiGet(keysOpened);
        if (!(keysClosed == null || keysClosed.isEmpty()))
            valuesClosed = redisTemplate.opsForValue().multiGet(keysClosed);

        if ((valuesOpened == null || valuesOpened.isEmpty()) && (valuesClosed == null || valuesClosed.isEmpty()))
            return Collections.emptyList();

        if (!(valuesOpened == null || valuesOpened.isEmpty()))
            yearlyOpenedClients = valuesOpened.stream()
                    .map(src -> {
                        ClientsAccountsCountDto map = modelMapper.map(src, ClientsAccountsCountDto.class);
                        map.setStatusType(ClientStatusEnum.ACTIVE.getShortFlag());
                        return map;
                    })
                    .toList();
        if (!(valuesClosed == null || valuesClosed.isEmpty()))
            yearlyClosedClients = valuesClosed.stream()
                    .map(src -> {
                        ClientsAccountsCountDto map = modelMapper.map(src, ClientsAccountsCountDto.class);
                        map.setStatusType(ClientStatusEnum.CLOSED.getShortFlag());
                        return map;
                    })
                    .toList();

        finalList.addAll(new ArrayList<>(yearlyOpenedClients));
        finalList.addAll(new ArrayList<>(yearlyClosedClients));
        return finalList;
    }
}

package com.diplomski.bank.service;

import com.diplomski.bank.model.*;
import com.diplomski.bank.model.dto.AccountClientTypeDetailDto;
import com.diplomski.bank.model.dto.OpenAccountDto;
import com.diplomski.bank.model.dto.ResponseDto;
import com.diplomski.bank.repository.*;
import com.diplomski.bank.util.ClientUtil;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Collections;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class AccountService {
    private final AccountRepository accountRepository;
    private final ModelMapper modelMapper;
    private final ClientRepository clientRepository;
    private final AccountTypeRepository accountTypeRepository;
    private final CurrencyRepository currencyRepository;
    private final RedisDataLoader redis;


    public List<AccountClientTypeDetailDto> getAccounts(String value) {
        return switch (value.length()) {
            case 4 -> getAccountsById(value);
            case 3 -> getAccountsByClientId(value);
            default -> getAccountsByName(value);
        };
    }

    private List<AccountClientTypeDetailDto> getAccountsById(String value) {
        if (value.matches("\\d+"))
            try {
                return mapAndReturn(accountRepository.findAccountsById(Long.valueOf(value)));
            } catch (Exception e) {
                log.error("Exception when finding accounts by ID, " + e.getMessage());
                return Collections.emptyList();
            }
        else
            return getAccountsByName(value);
    }

    private List<AccountClientTypeDetailDto> getAccountsByClientId(String value) {
        if (value.matches("\\d+"))
            try {
                return mapAndReturn(accountRepository.findAccountByClientId(Long.valueOf(value)));
            } catch (Exception e) {
                log.error("Exception when finding account by clients ID, " + e.getMessage());
                return Collections.emptyList();
            }
        else
            return getAccountsByName(value);
    }

    private List<AccountClientTypeDetailDto> getAccountsByName(String value) {
        try {
            String capitalCaseValue = value.toUpperCase();
            return mapAndReturn(accountRepository.findAccountByName(capitalCaseValue));
        } catch (Exception e) {
            log.error("Exception when finding accounts by name, " + e.getMessage());
            return Collections.emptyList();
        }
    }

    private List<AccountClientTypeDetailDto> mapAndReturn(List<Account> accountList) {
        if (accountList.isEmpty()) return Collections.emptyList();

        return accountList.stream()
                .map(src -> modelMapper.map(src, AccountClientTypeDetailDto.class))
                .toList();
    }

    @Transactional
    public ResponseDto<String> openNewAccount(OpenAccountDto openAccountDto) {
        ResponseDto<String> responseDto = new ResponseDto<>();

        try {
            LocalDate currentLocalDate = ClientUtil.getCurrentLocalDate();
            Account account = new Account();

            account.setOpeningDate(currentLocalDate);
            account.setName(openAccountDto.getName());
            account.setClient(getClient(openAccountDto.getClientId()));
            account.setAccountType(getAccountType(openAccountDto.getAccountTypeId()));
            account.setAccountDetail(getAccountDetailsAndCurrency(openAccountDto.getAccountDetailCurrencyAmmount(), openAccountDto.getAccountDetailCurrencyId()));
            account.setStatus('A');

            Account save = accountRepository.save(account);
            redis.lastFiveClientsAndAccountsDropAndFill();
            responseDto.setClientId(save.getClient().getId());

        } catch (Exception e) {
            log.error("Exception when opening new account, " + e.getMessage());
            responseDto.setErrorMessage(e.getMessage());
        }

        return responseDto;
    }

    private AccountDetail getAccountDetailsAndCurrency(Double ammount, Integer currencyid) {
        AccountDetail accountDetail = new AccountDetail();

        List<Currency> allCurrency = currencyRepository.findAll();
        Currency currency = allCurrency.stream().filter(src -> Objects.equals(src.getId(), currencyid))
                .toList().get(0);

        accountDetail.setCurrency(currency);
        accountDetail.setCurrencyAmount(Double.valueOf(ClientUtil.df.format(ammount)));

        return accountDetail;
    }

    private AccountType getAccountType(Integer value) {
        List<AccountType> all = accountTypeRepository.findAll();

        return all.stream()
                .filter(src -> Objects.equals(src.getId(), value))
                .toList().get(0);
    }

    private Client getClient(Long clientId) throws Exception {
        List<Client> clientById = clientRepository.findClientById(clientId);
        if (clientById.isEmpty())
            throw new Exception("Client not found");
        return clientById.get(0);
    }

    public ResponseDto<String> closeAccount(Long id) {
        ResponseDto<String> responseDto = new ResponseDto<>();

        try {
            LocalDate currentLocalDate = ClientUtil.getCurrentLocalDate();
            Optional<Account> byId = accountRepository.findById(id);
            Account account = byId.orElseThrow(() -> new Exception("Account not found"));

            account.setStatus('C');
            account.setClosingDate(currentLocalDate);

            accountRepository.save(account);
            redis.lastFiveClientsAndAccountsDropAndFill();

        } catch (Exception e) {
            log.error("Exception when closing account, " + e.getMessage());
            responseDto.setErrorMessage(e.getMessage());
        }

        return responseDto;
    }

    public ResponseDto<String> reOpenAccount(Long id) {
        ResponseDto<String> responseDto = new ResponseDto<>();

        try {
            LocalDate currentLocalDate = ClientUtil.getCurrentLocalDate();
            Optional<Account> byId = accountRepository.findById(id);
            Account account = byId.orElseThrow(() -> new Exception("Account not found"));

            account.setStatus('A');
            account.setEditDate(currentLocalDate);
            account.setClosingDate(null);

            accountRepository.save(account);
            redis.lastFiveClientsAndAccountsDropAndFill();

        } catch (Exception e) {
            log.error("Exception when reopening account, " + e.getMessage());
            responseDto.setErrorMessage(e.getMessage());
        }

        return responseDto;
    }
}

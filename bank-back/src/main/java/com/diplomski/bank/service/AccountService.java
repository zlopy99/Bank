package com.diplomski.bank.service;

import com.diplomski.bank.exception.ApiRequestException;
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
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class AccountService {
    private final AccountRepository accountRepository;
    private final ModelMapper modelMapper;
    private final ClientRepository clientRepository;
    private final AccountTypeRepository accountTypeRepository;
    private final CurrencyRepository currencyRepository;
    private final RedisDataLoader redis;
    private final AccountLogRepository accountLogRepository;


    public List<AccountClientTypeDetailDto> getAccounts(String value) {
        try {
            return switch (value.length()) {
                case 4 -> getAccountsById(value);
                case 3 -> getAccountsByClientId(value);
                default -> getAccountsByName(value);
            };

        } catch (Exception e) {
            String errMsg = "Exception occurred during account search. ";
            log.error(errMsg, e);
            throw new ApiRequestException(errMsg + e.getMessage());
        }
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
            logAccountActions(save, 'I');
            redis.lastFiveClientsAndAccountsDropAndFill();
            responseDto.setClientId(save.getClient().getId());

        } catch (Exception e) {
            String errMsg = "Exception when opening new account, ";
            log.error(errMsg + e.getMessage());
            responseDto.setErrorMessage(errMsg + e.getMessage());
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

            Account save = accountRepository.save(account);
            logAccountActions(save, 'C');
            redis.lastFiveClientsAndAccountsDropAndFill();

        } catch (Exception e) {
            String errMsg = "Exception when closing account, ";
            log.error(errMsg + e.getMessage());
            responseDto.setErrorMessage(errMsg + e.getMessage());
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

            Account save = accountRepository.save(account);
            logAccountActions(save, 'R');
            redis.lastFiveClientsAndAccountsDropAndFill();

        } catch (Exception e) {
            String errMsg = "Exception when reopening account, ";
            log.error(errMsg + e.getMessage());
            responseDto.setErrorMessage(errMsg + e.getMessage());
        }

        return responseDto;
    }

    private void logAccountActions(Account account, char action) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            User principal = (User) authentication.getPrincipal();
            String userEmail = principal.getUsername();

            AccountLog accountLog = AccountLog.builder()
                    .accountType(account.getAccountType().getName())
                    .accountId(account.getId())
                    .accountName(account.getName())
                    .logDate(ClientUtil.getCurrentLocalDateTime())
                    .closingDate(account.getClosingDate())
                    .action(action)
                    .currencyAmount(account.getAccountDetail().getCurrencyAmount())
                    .editDate(account.getEditDate())
                    .status(account.getStatus())
                    .openingDate(account.getOpeningDate())
                    .userEmail(userEmail)
                    .clientId(account.getClient().getId())
                    .currency(account.getAccountDetail().getCurrency().getName())
                    .build();

            accountLogRepository.save(accountLog);

        } catch (Exception e) {
            log.error("Exception occurred when logging account data. ", e);
        }
    }
}

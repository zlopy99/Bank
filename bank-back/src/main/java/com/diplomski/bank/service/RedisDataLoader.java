package com.diplomski.bank.service;

import com.diplomski.bank.exception.ApiRequestException;
import com.diplomski.bank.exception.ExceptionUtil;
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
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.data.redis.core.RedisCallback;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;

import java.util.*;

@Component
@RequiredArgsConstructor
@Slf4j
public class RedisDataLoader implements ApplicationRunner {
    private final RedisTemplate<String, Object> redisTemplate;
    private final ClientRepository clientRepository;
    private final AccountRepository accountRepository;
    private final CountryRepository countryRepository;
    private final CityRepository cityRepository;
    private final ModelMapper modelMapper;
    private final ObjectMapper objectMapper;

    @Override
    public void run(ApplicationArguments args) {
        testRedisConnection();
        flushAllFromMyRedisDb();
        lastFiveClientsAndAccounts();
        fillRedisWithCountries();
        fillRedisWithCities();
        getAndSetOpenedAccountsInAMonth();
        getAndSetOpenedAndClosedClientsInAWeek();
        getAndSetOpenedAndClosedClientsInAYear();
    }

    public void testRedisConnection() {
        try {
            String response = redisTemplate.getConnectionFactory().getConnection().ping();
            log.info("Redis connection successful: {}", response);
        } catch (Exception e) {
            log.error("Failed to connect to Redis: {}", e.getMessage());
        }
    }

    private void flushAllFromMyRedisDb() {
        try {
            redisTemplate.execute((RedisCallback<Object>) connection -> {
                connection.serverCommands().flushDb();
                return null;
            });
        } catch (Exception e) {
            String errMsg = "Error at clearing redis: ";
            log.error(errMsg, e);
            throw new ApiRequestException(errMsg + e.getMessage());
        }
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

        try {
            for (int i = 0; i < 5; i++) {
                if (!lastFiveOpenClients.isEmpty() && lastFiveOpenClients.size() >= 5)
                    redisTemplate.opsForValue().set("last_five_clients_" + i, lastFiveOpenClients.get(i));
                if (!lastFiveOpenAccounts.isEmpty() && lastFiveOpenAccounts.size() >= 5)
                    redisTemplate.opsForValue().set("last_five_accounts_" + i, lastFiveOpenAccounts.get(i));
            }
        } catch (IndexOutOfBoundsException e) {
            String message = ExceptionUtil.REDIS_ERROR + "setting first five clients and accounts: " + e.getMessage();
            log.error(message);
            throw new ApiRequestException(message, e);
        }
    }

    public ClientAccountDto getFirstFiveClientsAndAccounts() {
        List<ClientDto> clientDtoList = new ArrayList<>();;
        List<AccountDto> accountDtoList = new ArrayList<>();;

        try {
            for (int i = 0; i < 5; i++) {
                Client client = objectMapper.convertValue(redisTemplate.opsForValue().get("last_five_clients_" + i), Client.class);
                Account account = objectMapper.convertValue(redisTemplate.opsForValue().get("last_five_accounts_" + i), Account.class);

                if (client != null) {
                    clientDtoList.add(modelMapper.map(client, ClientDto.class));
                }
                if (account != null) {
                    accountDtoList.add(modelMapper.map(account, AccountDto.class));
                }
            }

            ClientAccountDto clientAccountDto = new ClientAccountDto();
            clientAccountDto.setClientDto(clientDtoList);
            clientAccountDto.setAccountDto(accountDtoList);

            return clientAccountDto;

        } catch (Exception e) {
            String message = ExceptionUtil.REDIS_ERROR + "getting first five clients and accounts: " + e.getMessage();
            log.error(message);
            throw new ApiRequestException(message, e);
        }
    }

    private void fillRedisWithCountries() {
        try {
            List<Country> countries = countryRepository.findAll();
            if (!countries.isEmpty())
                for (Country country: countries) {
                    redisTemplate.opsForValue().set("country" + "_" + country.getId() + "_" + country.getName().toLowerCase(), country);
                }
        } catch (Exception e) {
            String message = ExceptionUtil.REDIS_ERROR + "adding countries to redis: " + e.getMessage();
            log.error(message);
            throw new ApiRequestException(message, e);
        }
    }

    private void fillRedisWithCities() {
        try {
            List<City> cities = cityRepository.findAllWhereCountryIsBiH();
            if (!cities.isEmpty())
                for (City city: cities) {
                    redisTemplate.opsForValue().set("city" + "_" + city.getId() + "_" + city.getName().toLowerCase(), city);
                }
        } catch (Exception e) {
            String message = ExceptionUtil.REDIS_ERROR + "adding cities to redis: " + e.getMessage();
            log.error(message);
            throw new ApiRequestException(message, e);
        }
    }

    public List<CountryDto> getSelectedCountries(String value) {
        try {
            Set<String> keys = redisTemplate.keys("country_*" + value + "*");

            if (keys == null || keys.isEmpty())
                return Collections.emptyList();

            List<Object> values = redisTemplate.opsForValue().multiGet(keys);

            if (values == null || values.isEmpty())
                return Collections.emptyList();

            return values.stream()
                    .map(src -> modelMapper.map(src, CountryDto.class))
                    .toList();
        } catch (Exception e) {
            String message = ExceptionUtil.REDIS_ERROR + "getting countries from redis: " + e.getMessage();
            log.error(message);
            throw new ApiRequestException(message, e);
        }
    }

    public List<CityDto> getSelectedCities(String value) {
        try {
            Set<String> keys = redisTemplate.keys("city_*" + value + "*");

            if (keys == null || keys.isEmpty())
                return Collections.emptyList();

            List<Object> values = redisTemplate.opsForValue().multiGet(keys);

            if (values == null || values.isEmpty())
                return Collections.emptyList();

            return values.stream()
                    .map(src -> modelMapper.map(src, CityDto.class))
                    .toList();
        } catch (Exception e) {
            String message = ExceptionUtil.REDIS_ERROR + "getting cities from redis: " + e.getMessage();
            log.error(message);
            throw new ApiRequestException(message, e);
        }
    }

    public void getAndSetOpenedAccountsInAMonth() {
        try {
            List<Account> allAccountsOfLastMonth = accountRepository.getAllAccountsOfLastMonth();

            if (allAccountsOfLastMonth.isEmpty())
                return;

            for (Account account: allAccountsOfLastMonth) {
                redisTemplate.opsForValue().set("last_month_account_" + account.getId() + "_" + account.getAccountType().getName().toLowerCase(), account.getAccountType());
            }
        } catch (Exception e) {
            String message = ExceptionUtil.REDIS_ERROR + "setting opened accounts in a month: " + e.getMessage();
            log.error(message);
            throw new ApiRequestException(message, e);
        }
    }

    public Set<AccountTypeDto> getAllAccountsOpenedLastMonth() {
        try {
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
        } catch (Exception e) {
            String message = ExceptionUtil.REDIS_ERROR + "getting opened accounts in a month: " + e.getMessage();
            log.error(message);
            throw new ApiRequestException(message, e);
        }
    }

    public void getAndSetOpenedAndClosedClientsInAWeek() {
        try {
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
        } catch (Exception e) {
            String message = ExceptionUtil.REDIS_ERROR + "setting opened clients in : " + e.getMessage();
            log.error(message);
            throw new ApiRequestException(message, e);
        }
    }

    public List<ClientsInLastWeekDto> getAllClientsOpenedAndClosedLastWeek() {
        List<Object> valuesOpened = null;
        List<Object> valuesClosed = null;
        List<ClientsInLastWeekDto> lastWeekDtosOpened = new ArrayList<>();
        List<ClientsInLastWeekDto> lastWeekDtosClosed = new ArrayList<>();

        try {
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
        } catch (Exception e) {
            String message = ExceptionUtil.REDIS_ERROR + "getting all clients, opened and closed: " + e.getMessage();
            log.error(message);
            throw new ApiRequestException(message, e);
        }
    }

    public void getAndSetOpenedAndClosedClientsInAYear() {
        List<ClientsAccountsCountDto> clientsOpened = Collections.emptyList();
        List<ClientsAccountsCountDto> clientsClosed = Collections.emptyList();

        try {
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
        } catch (Exception e) {
            String message = ExceptionUtil.REDIS_ERROR + "setting opened and closed clients in a year: " + e.getMessage();
            log.error(message);
            throw new ApiRequestException(message, e);
        }
    }

    public List<ClientsAccountsCountDto> getAllOpenedAndClosedClientsYearly() {
        List<Object> valuesOpened = null;
        List<Object> valuesClosed = null;
        List<ClientsAccountsCountDto> yearlyOpenedClients = new ArrayList<>();
        List<ClientsAccountsCountDto> yearlyClosedClients = new ArrayList<>();
        List<ClientsAccountsCountDto> finalList = new ArrayList<>();

        try {
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
        }  catch (Exception e) {
            String message = ExceptionUtil.REDIS_ERROR + "getting all clients, opened and closed in a year: " + e.getMessage();
            log.error(message);
            throw new ApiRequestException(message, e);
        }
    }
}

package com.diplomski.bank.util;

import com.diplomski.bank.model.dto.AccountTypeDto;
import com.diplomski.bank.model.dto.ClientsInLastWeekDto;
import lombok.Getter;

import java.text.DecimalFormat;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Getter
public class ClientUtil {
    public final static String formatOfDate = "yyyy-MM-dd";
    public final static String formatOfDateTime = "yyyy-MM-dd HH:mm:ss";
    public final static DecimalFormat df = new DecimalFormat("#.##");

    private ClientUtil() {
    }

    public static LocalDate getCurrentLocalDate() {
        LocalDate localDate = LocalDate.now();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern(formatOfDate);
        String formattedDate = formatter.format(localDate);

        return LocalDate.parse(formattedDate);
    }

    public static LocalDateTime getCurrentLocalDateTime() {
        LocalDateTime localDate = LocalDateTime.now();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern(formatOfDateTime);
        String formattedDate = formatter.format(localDate);

        return LocalDateTime.parse(formattedDate, formatter);
    }

    public static Set<AccountTypeDto> calculatePercentage(List<AccountTypeDto> accountTypeDtoList) {
        int allOpenedAccounts = accountTypeDtoList.size();
        Map<Long, Double> accountTypeDtoMap = new HashMap<>();
        Set<AccountTypeDto> accountTypeDtoSet = new HashSet<>();

        for (AccountTypeDto accountTypeDto : accountTypeDtoList) {
            accountTypeDtoMap.put(accountTypeDto.getId(), accountTypeDtoMap.get(accountTypeDto.getId()) == null ? 1 : accountTypeDtoMap.get(accountTypeDto.getId()) + 1);
        }

        for (Map.Entry<Long, Double> entry : accountTypeDtoMap.entrySet()) {
            double v = Math.round((entry.getValue() / allOpenedAccounts * 100) * 10.0) / 10.0;
            accountTypeDtoSet.add(AccountTypeDto.builder().id(entry.getKey()).percentage(v).name(setName(entry.getKey())).build());
        }

        return accountTypeDtoSet;
    }

    private static String setName(Long id) {
        for (AccountTypeEnum accountTypeEnum : AccountTypeEnum.values()) {
            if (Long.parseLong(accountTypeEnum.getId().toString()) == id) {
                return accountTypeEnum.getName();
            }
        }
        return null;
    }

    public static List<ClientsInLastWeekDto> getOpenClientsByDay(List<ClientsInLastWeekDto> clientsInLastWeekDtos) {
        Map<String, Integer> clientsMap = new HashMap<>();
        Set<ClientsInLastWeekDto> lastWeekDtosOpened = new HashSet<>();

        for (ClientsInLastWeekDto c: clientsInLastWeekDtos) {
            clientsMap.put(c.getOpeningDate(), clientsMap.get(c.getOpeningDate()) == null ? 1 : clientsMap.get(c.getOpeningDate()) + 1);
        }

        for (Map.Entry<String, Integer> entry: clientsMap.entrySet()) {
            lastWeekDtosOpened.add(ClientsInLastWeekDto.builder().flag(ClientStatusEnum.ACTIVE.getShortFlag()).counter(entry.getValue()).openingDate(entry.getKey()).build());
        }

        return new ArrayList<>(lastWeekDtosOpened);
    }
    public static List<ClientsInLastWeekDto> getCloseClientsByDay(List<ClientsInLastWeekDto> clientsInLastWeekDtos) {
        Map<String, Integer> clientsMap = new HashMap<>();
        Set<ClientsInLastWeekDto> lastWeekDtosClosed = new HashSet<>();

        for (ClientsInLastWeekDto c: clientsInLastWeekDtos) {
            clientsMap.put(c.getClosingDate(), clientsMap.get(c.getClosingDate()) == null ? 1 : clientsMap.get(c.getClosingDate()) + 1);
        }

        for (Map.Entry<String, Integer> entry: clientsMap.entrySet()) {
            lastWeekDtosClosed.add(ClientsInLastWeekDto.builder().flag(ClientStatusEnum.CLOSED.getShortFlag()).counter(entry.getValue()).closingDate(entry.getKey()).build());
        }

        return new ArrayList<>(lastWeekDtosClosed);
    }
}

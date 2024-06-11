package com.diplomski.bank.model.dto;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

public class ClientAccountLogDto {
    private ClientAccountLogDto() {};

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class ClientLogDto {
        private Long id;
        private String userEmail;
        private Character action;
        private LocalDateTime logDate;
        private Long clientId;
        private String clientName;
        private String clientLastName;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class AccountLogDto {
        private Long id;
        private String userEmail;
        private Long clientId;
        private Character action;
        private LocalDateTime logDate;
        private Long accountId;
        private String accountName;
        private String accountType;
        private String clientName;
    }
}
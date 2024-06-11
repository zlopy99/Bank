package com.diplomski.bank.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.time.LocalDate;
import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
@Entity
@Table(name = "ACCOUNT_LOG")
public class AccountLog implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID")
    private Long id;

    @Column(name = "USER_EMAIL")
    private String userEmail;

    @Column(name = "ACTION")
    private Character action;

    @Column(name = "LOG_DATE")
    private LocalDateTime logDate;

    @Column(name = "CLIENT_ID")
    private Long clientId;

    @Column(name = "ACCOUNT_ID")
    private Long accountId;

    @Column(name = "ACCOUNT_NAME")
    private String accountName;

    @Column(name = "STATUS")
    private Character status;

    @Column(name = "OPENING_DATE")
    private LocalDate openingDate;

    @Column(name = "CLOSING_DATE")
    private LocalDate closingDate;

    @Column(name = "EDIT_DATE")
    private LocalDate editDate;

    @Column(name = "ACCOUNT_TYPE_NAME")
    private String accountType;

    @Column(name = "CURRENCY_AMOUNT")
    private Double currencyAmount;

    @Column(name = "CURRENCY")
    private String currency;
}

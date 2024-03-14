package com.diplomski.bank.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class AccountClientTypeDetailDto {
    private Long id;
    private String name;
    private LocalDate openingDate;
    private LocalDate closingDate;
    private Long accountTypeId;
    private String accountTypeName;
    private Long accountDetailId;
    private Double accountDetailCurrencyAmount;
    private String accountDetailCurrencyName;
    private Long accountDetailCurrencyId;
    private Long clientId;
    private String clientName;
    private String clientLastName;
    private LocalDate clientDateOfBirth;
    private String clientJmbg;
    private Character clientSex;
    private String clientPersonalDocId;
    private LocalDate clientOpeningDate;
    private LocalDate clientClosingDate;
    private Character status;
}

package com.diplomski.bank.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class OpenAccountDto {
    private String name;
    private Integer accountTypeId;
    private Double accountDetailCurrencyAmmount;
    private Integer accountDetailCurrencyId;
    private Long clientId;
}

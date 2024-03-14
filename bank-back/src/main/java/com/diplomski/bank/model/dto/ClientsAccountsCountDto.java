package com.diplomski.bank.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@AllArgsConstructor
@NoArgsConstructor
@Data
public class ClientsAccountsCountDto {
    private Long groupby;
    private Long count;
    private Character statusType;
}

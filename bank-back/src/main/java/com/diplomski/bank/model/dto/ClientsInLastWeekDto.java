package com.diplomski.bank.model.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class ClientsInLastWeekDto {
    private String openingDate;
    private String closingDate;
    private Integer counter;
    private Character flag;
}

package com.diplomski.bank.model.dto;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.time.LocalDate;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class ClientDto {
    private Long id;
    private String name;
    private String lastName;
    private LocalDate dateOfBirth;
    private String jmbg;
    private Character sex;
    private String personalDocId;
    private LocalDate openingDate;
    private LocalDate closingDate;
    private String status;
}

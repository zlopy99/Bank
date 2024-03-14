package com.diplomski.bank.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class SaveClientDto {
    private String clientId;
    private LocalDate dateOfBirth;
    private String jmbg;
    private String lastName;
    private String name;
    private Character sex;
    private String personalDocNumber;
    private String city;
    private String country;
    private Long cityId;
    private Long countryId;
    private String email;
    private String mobileNumber;
    private String parentName;
    private String phoneNumber;
    private String pttNumber;
    private String streetName;
    private String streetNumber;
    private String status;
    private List<AccountClientTypeDetailDto> openAccountDtoList;
}

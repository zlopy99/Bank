package com.diplomski.bank.config;

import com.diplomski.bank.model.Account;
import com.diplomski.bank.model.Client;
import com.diplomski.bank.model.ClientDetail;
import com.diplomski.bank.model.dto.AccountClientTypeDetailDto;
import com.diplomski.bank.model.dto.ClientDto;
import com.diplomski.bank.model.dto.SaveClientDto;
import com.diplomski.bank.util.ClientUtil;
import org.modelmapper.Converter;
import org.modelmapper.ModelMapper;
import org.modelmapper.convention.MatchingStrategies;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

@Configuration
public class ModelMapperConfig {
    @Bean
    public ModelMapper modelMapper() {
        ModelMapper modelMapper = new ModelMapper();
        modelMapper.getConfiguration().setSkipNullEnabled(true);
        modelMapper.getConfiguration().setMatchingStrategy(MatchingStrategies.STRICT);

        modelMapper.typeMap(ClientDetail.class, SaveClientDto.class)
                .addMapping(
                        ClientDetail::getParentName,
                        SaveClientDto::setParentName
                )
                .addMapping(
                        src -> src.getCityClientDetails().getId(),
                        SaveClientDto::setCityId
                )
                .addMapping(
                        src -> src.getCityClientDetails().getName(),
                        SaveClientDto::setCity
                )
                .addMapping(
                        src -> src.getCityClientDetails().getCountryCity().getId(),
                        SaveClientDto::setCountryId
                )
                .addMapping(
                        src -> src.getCityClientDetails().getCountryCity().getName(),
                        SaveClientDto::setCountry
                )
                .addMapping(
                        ClientDetail::getStreetName,
                        SaveClientDto::setStreetName
                );

        modelMapper.typeMap(Client.class, SaveClientDto.class)
                .addMapping(
                        Client::getPersonalDocId,
                        SaveClientDto::setPersonalDocNumber
                );

        modelMapper.typeMap(SaveClientDto.class, Client.class)
                .addMapping(
                        SaveClientDto::getJmbg,
                        Client::setJmbg
                )
                .addMapping(
                        SaveClientDto::getName,
                        Client::setName
                )
                .addMapping(
                        SaveClientDto::getLastName,
                        Client::setLastName
                )
                .addMapping(
                        SaveClientDto::getPersonalDocNumber,
                        Client::setPersonalDocId
                )
                .addMapping(
                        SaveClientDto::getSex,
                        Client::setSex
                )
                .addMapping(
                        SaveClientDto::getDateOfBirth,
                        Client::setDateOfBirth
                );

        modelMapper.typeMap(SaveClientDto.class, ClientDetail.class)
                .addMapping(
                        SaveClientDto::getEmail,
                        ClientDetail::setEmail
                )
                .addMapping(
                        SaveClientDto::getParentName,
                        ClientDetail::setParentName
                )
                .addMapping(
                        SaveClientDto::getMobileNumber,
                        ClientDetail::setMobileNumber
                )
                .addMapping(
                        SaveClientDto::getPhoneNumber,
                        ClientDetail::setPhoneNumber
                )
                .addMapping(
                        SaveClientDto::getPttNumber,
                        ClientDetail::setPttNumber
                )
                .addMapping(
                        SaveClientDto::getStreetName,
                        ClientDetail::setStreetName
                )
                .addMapping(
                        SaveClientDto::getStreetNumber,
                        ClientDetail::setStreetNumber
                );

        modelMapper.typeMap(Account.class, AccountClientTypeDetailDto.class)
                .addMapping(
                        src -> src.getAccountType().getId(),
                        AccountClientTypeDetailDto::setAccountTypeId
                )
                .addMapping(
                        src -> src.getAccountType().getName(),
                        AccountClientTypeDetailDto::setAccountTypeName
                )
                .addMapping(
                        src -> src.getAccountDetail().getId(),
                        AccountClientTypeDetailDto::setAccountDetailId
                )
                .addMapping(
                        src -> src.getAccountDetail().getCurrencyAmount(),
                        AccountClientTypeDetailDto::setAccountDetailCurrencyAmount
                )
                .addMapping(
                        src -> src.getAccountDetail().getCurrency().getId(),
                        AccountClientTypeDetailDto::setAccountDetailCurrencyId
                )
                .addMapping(
                        src -> src.getAccountDetail().getCurrency().getName(),
                        AccountClientTypeDetailDto::setAccountDetailCurrencyName
                )
                .addMapping(
                        src -> src.getClient().getId(),
                        AccountClientTypeDetailDto::setClientId
                )
                .addMapping(
                        src -> src.getClient().getName(),
                        AccountClientTypeDetailDto::setClientName
                )
                .addMapping(
                        Account::getStatus,
                        AccountClientTypeDetailDto::setStatus
                );


        return modelMapper;
    }
}

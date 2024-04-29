package com.diplomski.bank.controller;

import com.diplomski.bank.model.dto.*;
import com.diplomski.bank.service.ClientService;
import com.diplomski.bank.service.RedisDataLoader;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/client")
@RequiredArgsConstructor
public class ClientController {
    private final ClientService clientService;
    private final RedisDataLoader redis;

    @GetMapping("/firstFive")
    public ResponseEntity<ClientAccountDto> getFirstFiveClientsAndAccounts() {
        return ResponseEntity.ok(redis.getFirstFiveClientsAndAccounts());
    }

    @GetMapping("/{value}")
    public ResponseEntity<List<ClientDto>> getClients(@PathVariable String value) {
        return ResponseEntity.ok(clientService.getClients(value));
    }

    @PostMapping
    public ResponseEntity<ResponseDto<SaveClientDto>> openClient(@RequestBody SaveClientDto saveClientDto) {
        return ResponseEntity.ok(clientService.openClient(saveClientDto));
    }

    @PutMapping("/edit/{clientId}")
    public ResponseEntity<ResponseDto<String>> editClient(@RequestBody SaveClientDto saveClientDto, @PathVariable Long clientId) {
        return ResponseEntity.ok(clientService.editClient(saveClientDto, clientId));
    }

    @DeleteMapping("/delete/{clientId}")
    public ResponseEntity<ResponseDto<String>> deleteClient(@PathVariable Long clientId) {
        return ResponseEntity.ok(clientService.deleteClient(clientId));
    }

    @GetMapping("/countries/{value}")
    public ResponseEntity<List<CountryDto>> getCountriesFromRedis(@PathVariable String value) {
        return ResponseEntity.ok(redis.getSelectedCountries(value));
    }

    @GetMapping("/cities/{value}")
    public ResponseEntity<List<CityDto>> getSelectedCities(@PathVariable String value) {
        return ResponseEntity.ok(redis.getSelectedCities(value));
    }

    @GetMapping("/details/{value}")
    public ResponseEntity<ResponseDto<SaveClientDto>> getClientDetails(@PathVariable Long value) {
        return ResponseEntity.ok(clientService.getClientDetails(value));
    }

    @PutMapping("/reopen")
    public ResponseEntity<ResponseDto<String>> reopenClient(@RequestBody ClientDto clientDto) {
        return ResponseEntity.ok(clientService.reopenClient(clientDto));
    }

    @GetMapping("/lastWeekClients")
    public ResponseEntity<List<ClientsInLastWeekDto>> getAllClientsOpenedAndClosedLastWeek() {
        return ResponseEntity.ok(redis.getAllClientsOpenedAndClosedLastWeek());
    }

    @GetMapping("/yearlyClients")
    public ResponseEntity<List<ClientsAccountsCountDto>> getAllOpenedAndClosedClientsYearly() {
        return ResponseEntity.ok(redis.getAllOpenedAndClosedClientsYearly());
    }

}

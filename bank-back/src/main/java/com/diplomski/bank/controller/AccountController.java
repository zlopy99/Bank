package com.diplomski.bank.controller;

import com.diplomski.bank.model.dto.AccountClientTypeDetailDto;
import com.diplomski.bank.model.dto.AccountTypeDto;
import com.diplomski.bank.model.dto.OpenAccountDto;
import com.diplomski.bank.model.dto.ResponseDto;
import com.diplomski.bank.service.AccountService;
import com.diplomski.bank.service.RedisDataLoader;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api/account")
@RequiredArgsConstructor
public class AccountController {
    private final AccountService accountService;
    private final RedisDataLoader redis;

    @GetMapping("/{value}")
    public ResponseEntity<List<AccountClientTypeDetailDto>> getAccounts(@PathVariable String value) {
        return ResponseEntity.ok(accountService.getAccounts(value));
    }

    @PostMapping()
    public ResponseEntity<ResponseDto<String>> openNewAccount(@RequestBody OpenAccountDto openAccountDto) {
        return ResponseEntity.ok(accountService.openNewAccount(openAccountDto));
    }

    @DeleteMapping("/close/{id}")
    public ResponseEntity<ResponseDto<String>> closeAccount(@PathVariable Long id) {
        return ResponseEntity.ok(accountService.closeAccount(id));
    }

    @GetMapping("/reOpen/{id}")
    public ResponseEntity<ResponseDto<String>> reOpenAccount(@PathVariable Long id) {
        return ResponseEntity.ok(accountService.reOpenAccount(id));
    }

    @GetMapping("/lastMonthAccounts")
    public ResponseEntity<Set<AccountTypeDto>> getAllAccountsOpenedLastMonth() {
        return ResponseEntity.ok(redis.getAllAccountsOpenedLastMonth());
    }

}

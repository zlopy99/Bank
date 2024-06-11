package com.diplomski.bank.controller;

import com.diplomski.bank.model.dto.ClientAccountLogDto;
import com.diplomski.bank.model.dto.ResponseDto;
import com.diplomski.bank.model.dto.UserDto;
import com.diplomski.bank.service.UserService;
import jakarta.annotation.Nullable;
import jakarta.annotation.security.PermitAll;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    @PostMapping
    public ResponseEntity<ResponseDto<UserDto>> createUser(@RequestPart("user") UserDto userDto, @RequestPart(value = "file", required = false) MultipartFile file) {
        return ResponseEntity.ok(userService.createUser(userDto, file));
    }

    @GetMapping("/allUsers/{inputValue}")
    public ResponseEntity<List<UserDto>> getAllUsers(@PathVariable String inputValue) {
        return ResponseEntity.ok(userService.getAllUsers(inputValue));
    }

    @GetMapping("/user/{id}")
    public ResponseEntity<UserDto> getUser(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getUser(id));
    }

    @PutMapping
    public ResponseEntity<UserDto> editUser(@RequestPart("user") UserDto userDto, @RequestPart(value = "file", required = false) MultipartFile file) {
        return ResponseEntity.ok(userService.editUser(userDto, file));
    }

    @GetMapping("/user/logData/client/{email}")
    public ResponseEntity<List<ClientAccountLogDto.ClientLogDto>> getLogDataClient(@PathVariable String email) {
        return ResponseEntity.ok(userService.getLogDataClient(email));
    }

    @GetMapping("/user/logData/account/{email}")
    public ResponseEntity<List<ClientAccountLogDto.AccountLogDto>> getLogDataAccount(@PathVariable String email) {
        return ResponseEntity.ok(userService.getLogDataAccount(email));
    }
}

package com.diplomski.bank.controller;

import com.diplomski.bank.model.dto.ResponseDto;
import com.diplomski.bank.model.dto.UserDto;
import com.diplomski.bank.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    @PostMapping
    public ResponseEntity<ResponseDto<UserDto>> CreateUser(@RequestBody UserDto userDto) {
        return ResponseEntity.ok(userService.createUser(userDto));
    }
}

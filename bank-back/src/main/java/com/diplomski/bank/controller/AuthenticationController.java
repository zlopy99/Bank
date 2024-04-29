package com.diplomski.bank.controller;

import com.diplomski.bank.model.dto.AuthRequest;
import com.diplomski.bank.service.AuthenticationService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthenticationController {
    private final AuthenticationService authenticationService;

    @PostMapping("/login")
    public ResponseEntity<Void> login(
            @RequestBody AuthRequest authRequest,
            HttpServletRequest request,
            HttpServletResponse response
    ) {
        authenticationService.login(authRequest, request, response);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/refreshToken")
    public ResponseEntity<Void> refreshToken(HttpServletRequest request, HttpServletResponse response) {
        authenticationService.refreshToken(request, response);
        return ResponseEntity.ok().build();
    }
}

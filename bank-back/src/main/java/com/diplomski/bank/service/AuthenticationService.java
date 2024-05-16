package com.diplomski.bank.service;

import com.diplomski.bank.exception.ApiRequestException;
import com.diplomski.bank.exception.ExceptionUtil;
import com.diplomski.bank.model.RefreshToken;
import com.diplomski.bank.model.Users;
import com.diplomski.bank.model.dto.AuthRequest;
import com.diplomski.bank.repository.RefreshTokenRepository;
import com.diplomski.bank.repository.UsersRepository;
import com.diplomski.bank.security.JwtUtil;
import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Optional;

import static org.springframework.http.HttpHeaders.AUTHORIZATION;

@Service
@Slf4j
@RequiredArgsConstructor
public class AuthenticationService {
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final MyUserDetailService myUserDetailService;
    private final RefreshTokenRepository refreshTokenRepository;
    private final UsersRepository usersRepository;

    public void login(
            AuthRequest authRequest,
            HttpServletRequest request,
            HttpServletResponse response
    ) {
        RefreshToken refreshTokenDb = new RefreshToken();
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

            if (authentication == null || "anonymousUser".equals(authentication.getPrincipal())) {
                Authentication authenticate = authenticationManager.authenticate(
                        new UsernamePasswordAuthenticationToken(authRequest.getEmail(), authRequest.getPassword())
                );

                if (authenticate.isAuthenticated()) {
                    String refreshToken = jwtUtil.createRefreshToken((UserDetails) authenticate.getPrincipal());
                    Users user = usersRepository.findByEmail(authRequest.getEmail())
                            .orElseThrow(Exception::new);

                    refreshTokenDb.setToken(refreshToken);
                    refreshTokenDb.setUser(user);
                    refreshTokenRepository.save(refreshTokenDb);

                    String accessToken = jwtUtil.generateToken((UserDetails) authenticate.getPrincipal());

                    response.setHeader("access_token", accessToken);
                    response.setHeader("refresh_token", refreshToken);
                } else
                    throw new ApiRequestException("Something went bad at token creation or user authentication. ");
            } else
                throw new ApiRequestException("User allready loged in. ");

        } catch (AuthenticationException e) {
            log.error(ExceptionUtil.INVALID_USERNAME_AND_PASSWORD + e.getMessage(), e);
            throw new BadCredentialsException(ExceptionUtil.INVALID_USERNAME_AND_PASSWORD, e);
        } catch (ApiRequestException e) {
            log.error(e.getMessage(), e);
            throw e;
        } catch (Exception e) {
            log.error(ExceptionUtil.GLOBAL_EXCEPTION_MSG + e.getMessage(), e);
            throw new ApiRequestException(ExceptionUtil.GLOBAL_EXCEPTION_MSG, e);
        }
    }

    public void refreshToken(HttpServletRequest request, HttpServletResponse response) {
        final String authHeader = request.getHeader(AUTHORIZATION);
        String refreshToken = null;

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new ApiRequestException("Refresh token does not exist. ");
        }

        try {
            refreshToken = authHeader.substring(7);
            Optional<RefreshToken> refreshTokenDb = refreshTokenRepository.findByToken(refreshToken);
            if (refreshTokenDb.isPresent()) {

                if (jwtUtil.isTokenExpired(refreshToken))
                    throw new ExpiredJwtException(null, null, "Expired refresh token");

                UserDetails userDetails = myUserDetailService.loadUserByUsername(refreshTokenDb.get().getUser().getEmail());

                if (userDetails != null) {
                    String accessToken = jwtUtil.generateToken(userDetails);

                    response.setHeader("access_token", accessToken);
                    response.setHeader("refresh_token", refreshToken);
                }
            } else
                throw new ApiRequestException("Refresh token does not exist. ");


        } catch (ApiRequestException e) {
            log.error(e.getMessage(), e);
            throw new ApiRequestException(e.getMessage());
        } catch (UsernameNotFoundException e) {
            String userNameNotFound = "Username not found. ";
            log.error(userNameNotFound, e);
            throw new ApiRequestException(userNameNotFound + e.getMessage());
        } catch (ExpiredJwtException e) {
            if (refreshToken != null)
                refreshTokenRepository.deleteByToken(refreshToken);
            String expiredToken = "Expired token. ";
            log.error(expiredToken, e);
        } catch (Exception e) {
            String unexpectedException = "Unexpected exception. ";
            log.error(unexpectedException, e);
            throw new ApiRequestException(unexpectedException + e.getMessage());
        }
    }

    public void logout(String refreshToken) {
        try {
            refreshTokenRepository.deleteByToken(refreshToken);

        } catch (Exception e) {
            String unexpectedException = "Exception when trying to delete refresh token. ";
            log.error(unexpectedException, e);
            throw new ApiRequestException(unexpectedException + e.getMessage());
        }
    }
}

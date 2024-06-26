package com.diplomski.bank.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.time.ZoneId;
import java.time.ZonedDateTime;

@ControllerAdvice
public class ApiExceptionHandler {

    @ExceptionHandler(value = {ApiRequestException.class})
    public ResponseEntity<Object> handleApiRequestException(ApiRequestException e) {
        HttpStatus badRequest = HttpStatus.INTERNAL_SERVER_ERROR;

        ApiExceptionDto apiExceptionDto = new ApiExceptionDto(
                e.getMessage(),
                badRequest,
                ZonedDateTime.now(ZoneId.of("Europe/Sarajevo"))
        );

        return new ResponseEntity<>(apiExceptionDto, badRequest);
    }

    @ExceptionHandler(value = {CustomeExpiredJwtException.class})
    public ResponseEntity<Object> handleExpiredJwtException(CustomeExpiredJwtException e) {
        HttpStatus badRequest = HttpStatus.UNAUTHORIZED;

        ApiExceptionDto apiExceptionDto = new ApiExceptionDto(
                e.getMessage(),
                badRequest,
                ZonedDateTime.now(ZoneId.of("Europe/Sarajevo"))
        );

        return new ResponseEntity<>(apiExceptionDto, badRequest);
    }
}

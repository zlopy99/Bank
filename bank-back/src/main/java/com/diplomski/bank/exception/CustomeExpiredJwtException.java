package com.diplomski.bank.exception;

public class CustomeExpiredJwtException extends RuntimeException {
    public CustomeExpiredJwtException(String message) {
        super(message);
    }

    public CustomeExpiredJwtException(String message, Throwable cause) {
        super(message, cause);
    }
}

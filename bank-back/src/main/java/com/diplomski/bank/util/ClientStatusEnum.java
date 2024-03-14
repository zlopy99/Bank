package com.diplomski.bank.util;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum ClientStatusEnum {
    ACTIVE('A'),
    CLOSED('C');

    private final Character shortFlag;
}
package com.diplomski.bank.util;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public enum RolesEnum {
    ADMIN(1,"ADMIN"),
    BANKER_CLIENT(2,"BANKER_CLIENT"),
    BANKER_ACCOUNT(3,"BANKER_ACCOUNT"),
    BANKER_OBSERVE(4,"BANKER_OBSERVE");

    private final Integer id;
    private final String name;
}

package com.diplomski.bank.util;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum AccountTypeEnum {
    SAVINGS_ACCOUNT(1, "Savings Account"),
    STUDENT_CHECKING_ACCOUNT(2, "Student Checking Account"),
    JOINT_ACCOUNT(3, "Joint Account"),
    CHECKING_ACCOUNT(4, "Checking Account"),
    RETIREMENT_ACCOUNT(5, "Individual Retirement Account");

    private final Integer id;
    private final String name;
}

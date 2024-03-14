package com.diplomski.bank.repository;

import com.diplomski.bank.model.AccountType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AccountTypeRepository extends JpaRepository<AccountType, Integer> {
    AccountType findAccountTypeById(Integer id);
}

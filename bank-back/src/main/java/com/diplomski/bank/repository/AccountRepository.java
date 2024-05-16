package com.diplomski.bank.repository;

import com.diplomski.bank.model.Account;
import com.diplomski.bank.model.Client;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AccountRepository extends JpaRepository<Account, Long> {
    @Query(value = """
            select a from Account a order by a.id desc limit 5
            """)
    List<Account> getLastFiveOpenAccounts();
    List<Account> findAccountsById(Long value);
    @Query(value = """
            select a from Account a where a.name like :value%
            """)
    List<Account> findAccountByName(String value);
    @Query(value = """
            select c.accounts from Client c where c.id = :value
            """)
    List<Account> findAccountByClientId(Long value);
    @Query(value = """
            select * from public.account
            where opening_date >= date_trunc('month', current_date - interval '1 month')
            and opening_date < date_trunc('day', current_date + interval '1 day')
            """, nativeQuery = true)
    List<Account> getAllAccountsOfLastMonth();
}

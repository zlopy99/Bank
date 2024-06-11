package com.diplomski.bank.repository;

import com.diplomski.bank.model.AccountLog;
import com.diplomski.bank.model.ClientLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AccountLogRepository extends JpaRepository<AccountLog, Long> {
    List<AccountLog> findByUserEmail(String email);
}

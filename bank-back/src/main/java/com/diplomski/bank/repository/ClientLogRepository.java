package com.diplomski.bank.repository;

import com.diplomski.bank.model.ClientLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ClientLogRepository extends JpaRepository<ClientLog, Long> {
    List<ClientLog> findByUserEmail(String email);
}

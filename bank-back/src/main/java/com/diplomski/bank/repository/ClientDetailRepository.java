package com.diplomski.bank.repository;

import com.diplomski.bank.model.ClientDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ClientDetailRepository extends JpaRepository<ClientDetail, Long> {
}

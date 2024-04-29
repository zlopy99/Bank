package com.diplomski.bank.repository;

import com.diplomski.bank.model.Role;
import org.springframework.data.jpa.repository.JpaRepository;


public interface RoleRepository extends JpaRepository<Role, Long> {
}

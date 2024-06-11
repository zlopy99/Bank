package com.diplomski.bank.repository;

import com.diplomski.bank.model.Users;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface UsersRepository extends JpaRepository<Users, Long> {

    Optional<Users> findByEmail(String email);

    @Query(value = """
            select u from Users u where u.name like %:inputValue%
            """)
    List<Users> findAllLikeInputValue(String inputValue, Pageable pageable);
}

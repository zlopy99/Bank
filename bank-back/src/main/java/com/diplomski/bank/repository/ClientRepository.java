package com.diplomski.bank.repository;

import com.diplomski.bank.model.Client;
import com.diplomski.bank.model.dto.ClientsAccountsCountDto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Repository
public interface ClientRepository extends JpaRepository<Client, Long> {
    @Query(value = """
            select c from Client c order by c.id desc limit 5
            """)
    List<Client> getLastFiveOpenClients();

    @Query(value = """
            select c from Client c where c.name like :value% or c.lastName like :value%
            """)
    List<Client> findClientsByNameOrLastNameUsingLike(String value);

    List<Client> findClientByPersonalDocId(String value);

    List<Client> findClientByJmbg(String value);

    List<Client> findClientById(Long value);

    @Query(value = """
            select * from public.client
            where opening_date >= date_trunc('week', current_date - interval '1 week')
            and opening_date < date_trunc('day', current_date + interval '1 day')
            """, nativeQuery = true)
    List<Client> getAllClientsOfLastWeekOpened();

    @Query(value = """
            select * from public.client
            where closing_date >= date_trunc('week', current_date - interval '1 week')
            and closing_date < date_trunc('day', current_date + interval '1 day')
            """, nativeQuery = true)
    List<Client> getAllClientsOfLastWeekClosed();

    @Query(value = """
            SELECT
                EXTRACT(month FROM opening_date) AS groupBy,
                COUNT(*) AS count
            FROM
                public.client
            WHERE
                EXTRACT(year FROM opening_date) = EXTRACT(year FROM current_date)
            GROUP BY
                EXTRACT(month FROM opening_date);
            """, nativeQuery = true)
    List<Map<Long, Long>> getAllClientsOpenedInAYear();

    @Query(value = """
            SELECT
                EXTRACT(month FROM closing_date) AS groupBy,
                COUNT(*) AS count
            FROM
                public.client
            WHERE
                EXTRACT(year FROM closing_date) = EXTRACT(year FROM current_date)
            GROUP BY
                EXTRACT(month FROM closing_date);
                        """, nativeQuery = true)
    List<Map<Long, Long>> getAllClientsClosedInAYear();
}

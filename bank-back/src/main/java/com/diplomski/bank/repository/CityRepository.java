package com.diplomski.bank.repository;

import com.diplomski.bank.model.City;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CityRepository extends JpaRepository<City, Long> {
    @Query(
            value = """
                    select c from City c where c.countryCity.id = 22
                    """
    )
    List<City> findAllWhereCountryIsBiH();
}

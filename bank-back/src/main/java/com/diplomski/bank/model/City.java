package com.diplomski.bank.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Table(name = "CITY")
public class City implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID")
    private Long id;
    @Column(name = "NAME")
    private String name;
    @JsonIgnore
    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "country_id" )
    private Country countryCity;
    @JsonIgnore
    @ToString.Exclude
    @OneToMany(mappedBy = "cityClientDetails", fetch = FetchType.LAZY)
    private List<ClientDetail> clientDetails = new ArrayList<>();
}

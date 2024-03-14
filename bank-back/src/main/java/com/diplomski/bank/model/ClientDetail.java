package com.diplomski.bank.model;

import com.diplomski.bank.model.dto.ClientDto;
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
@Table(name = "CLIENT_DETAIL")
public class ClientDetail implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID")
    private Long id;
    @Column(name = "PARENT_NAME")
    private String parentName;
    @Column(name = "STREET_NAME")
    private String streetName;
    @Column(name = "STREET_NUMBER")
    private String streetNumber;
    @Column(name = "PTT_NUMBER")
    private String pttNumber;
    @Column(name = "PHONE_NUMBER")
    private String phoneNumber;
    @Column(name = "MOBILE_NUMBER")
    private String mobileNumber;
    @Column(name = "EMAIL")
    private String email;
    @JsonIgnore
    @ToString.Exclude
    @OneToMany(mappedBy = "clientDetail", fetch = FetchType.LAZY)
    private List<Client> clients = new ArrayList<>();
    @JsonIgnore
    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "city_id" )
    private City cityClientDetails;
}

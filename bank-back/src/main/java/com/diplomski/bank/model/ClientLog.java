package com.diplomski.bank.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.time.LocalDate;
import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Builder
@Table(name = "CLIENT_LOG")
public class ClientLog implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID")
    private Long id;

    @Column(name = "USER_EMAIL")
    private String userEmail;

    @Column(name = "ACTION")
    private Character action;

    @Column(name = "LOG_DATE")
    private LocalDateTime logDate;

    @Column(name = "CLIENT_ID")
    private Long clientId;

    @Column(name = "CLIENT_NAME")
    private String clientName;

    @Column(name = "LAST_NAME")
    private String clientLastName;

    @Column(name = "JMBG")
    private String jmbg;

    @Column(name = "SEX")
    private Character sex;

    @Column(name = "STATUS")
    private Character status;

    @Column(name = "PERSONAL_DOC_ID")
    private String personalDocId;

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
}

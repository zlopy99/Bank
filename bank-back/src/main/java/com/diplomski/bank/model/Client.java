package com.diplomski.bank.model;

import com.diplomski.bank.config.serializer.CustomDateDeserializer;
import com.diplomski.bank.config.serializer.CustomDateSerializer;
import com.diplomski.bank.config.serializer.JsonSerializer;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.context.annotation.Bean;

import java.io.IOException;
import java.io.Serializable;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;


@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Table(name = "CLIENT")
public class Client implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "client_generator")
    @SequenceGenerator(name = "client_generator", sequenceName = "client_sequence", allocationSize = 1, initialValue = 100)
    @Column(name = "ID")
    private Long id;
    @Column(name = "NAME")
    private String name;
    @Column(name = "LAST_NAME")
    private String lastName;
    @JsonSerialize(using = CustomDateSerializer.class)
    @JsonDeserialize(using = CustomDateDeserializer.class)
    @Column(name = "DATE_OF_BIRTH")
    private LocalDate dateOfBirth;
    @Column(name = "JMBG")
    private String jmbg;
    @Column(name = "SEX")
    private Character sex;
    @Column(name = "STATUS")
    private Character status;
    @Column(name = "PERSONAL_DOC_ID")
    private String personalDocId;
    @JsonSerialize(using = CustomDateSerializer.class)
    @JsonDeserialize(using = CustomDateDeserializer.class)
    @Column(name = "OPENING_DATE")
    private LocalDate openingDate;
    @JsonSerialize(using = CustomDateSerializer.class)
    @JsonDeserialize(using = CustomDateDeserializer.class)
    @Column(name = "EDIT_DATE")
    private LocalDate editDate;
    @JsonSerialize(using = CustomDateSerializer.class)
    @JsonDeserialize(using = CustomDateDeserializer.class)
    @Column(name = "CLOSING_DATE")
    private LocalDate closingDate;
    @JsonIgnore
    @ToString.Exclude
    @OneToMany(mappedBy = "client", fetch = FetchType.LAZY)
    private List<Account> accounts = new ArrayList<>();
    @JsonIgnore
    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "client_detail_id" )
    private ClientDetail clientDetail;
}


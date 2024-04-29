package com.diplomski.bank;

import com.ulisesbocchio.jasyptspringboot.annotation.EnableEncryptableProperties;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;


@SpringBootApplication
@EnableEncryptableProperties
public class BankApplication {


	public static void main(String[] args) {
		SpringApplication.run(BankApplication.class, args);
	}
}

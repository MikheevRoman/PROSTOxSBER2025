package ru.sberhack2025.companyevents;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class CompanyEventsApplication {

	public static void main(String[] args) {
		SpringApplication.run(CompanyEventsApplication.class, args);
	}

}

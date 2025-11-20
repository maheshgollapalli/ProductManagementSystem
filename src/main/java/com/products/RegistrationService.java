package com.products;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class RegistrationService {
	@Autowired
	private RegistrationRepository repo;
	
	public RegistrationEntity addingDetails(RegistrationEntity reg) {
		return repo.save(reg);
	}

	public RegistrationEntity checkingLogin(String email, String password) {
	    return repo.findByEmailAndPassword(email, password).orElse(new RegistrationEntity());  
	}

}

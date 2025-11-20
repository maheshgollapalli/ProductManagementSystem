package com.products;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
public class RegistrationController {

    @Autowired
    RegistrationService service;

    @PostMapping("/registration")
    public RegistrationEntity addDetails(@RequestBody RegistrationEntity reg) {
        return service.addingDetails(reg);
    }

    @GetMapping("/login")
    public RegistrationEntity checkLogin(@RequestParam(required = true) String email,
                                         @RequestParam(required = true) String password) {
        if (email == null || email.isEmpty() || password == null || password.isEmpty()) {
            throw new IllegalArgumentException("Email and password required");
        }

        return service.checkingLogin(email, password);
    }
}

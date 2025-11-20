package com.products;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RegistrationRepository extends JpaRepository<RegistrationEntity, Integer> {
	Optional<RegistrationEntity> findByEmailAndPassword(String email, String password);

}

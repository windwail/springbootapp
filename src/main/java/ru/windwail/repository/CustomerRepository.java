package ru.windwail.repository;

import java.util.List;

import org.springframework.data.repository.CrudRepository;
import ru.windwail.entity.Customer;

public interface CustomerRepository extends CrudRepository<Customer, Long> {

    List<Customer> findByLastName(String lastName);
}

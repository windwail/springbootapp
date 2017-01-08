package ru.windwail.rest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import ru.windwail.entity.Customer;
import ru.windwail.repository.CustomerRepository;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

@RestController
public class CustomerController {

    @Autowired
    CustomerRepository repository;


    @RequestMapping(value = "/customers", method = RequestMethod.GET, produces = "application/json")
    public List<Customer> customers() {
        List<Customer> customers = new ArrayList<>();
        repository.findAll().forEach(x -> customers.add(x));

        return customers;
    }

    @RequestMapping(value = "/data", method = RequestMethod.GET, produces = "application/json")
    public List<String> data() {
        List<String> data = new ArrayList<>();

        data.add("This");
        data.add("data");
        data.add("is");
        data.add("from");
        data.add("server!");

        return data;
    }
}

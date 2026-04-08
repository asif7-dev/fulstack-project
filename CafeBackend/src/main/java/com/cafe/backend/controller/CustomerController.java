package com.cafe.backend.controller;

import com.cafe.backend.model.Customer;
import com.cafe.backend.service.CustomerService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/customers")
@RequiredArgsConstructor
@Tag(name = "Customer Management", description = "Endpoints for managing customer data and loyalty")
public class CustomerController {

    private final CustomerService customerService;

    @GetMapping
    @Operation(summary = "Get all customers")
    public List<Customer> getAllCustomers() {
        return customerService.getAllCustomers();
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get customer by ID")
    public Customer getCustomerById(@PathVariable String id) {
        return customerService.getCustomerById(id);
    }

    @PostMapping
    @Operation(summary = "Create a new customer")
    public Customer createCustomer(@RequestBody Customer customer) {
        return customerService.createCustomer(customer);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an existing customer")
    public Customer updateCustomer(@PathVariable String id, @RequestBody Customer customer) {
        return customerService.updateCustomer(id, customer);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a customer")
    public ResponseEntity<Void> deleteCustomer(@PathVariable String id) {
        customerService.deleteCustomer(id);
        return ResponseEntity.noContent().build();
    }
}

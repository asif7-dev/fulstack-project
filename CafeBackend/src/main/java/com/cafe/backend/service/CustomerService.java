package com.cafe.backend.service;

import com.cafe.backend.exception.ResourceNotFoundException;
import com.cafe.backend.model.Customer;
import com.cafe.backend.repository.CustomerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CustomerService {

    private final CustomerRepository customerRepository;

    public List<Customer> getAllCustomers() {
        return customerRepository.findAll();
    }

    public Customer getCustomerById(String id) {
        return customerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with id: " + id));
    }

    public Customer createCustomer(Customer customer) {
        return customerRepository.save(customer);
    }

    public Customer updateCustomer(String id, Customer customerDetails) {
        Customer customer = getCustomerById(id);
        customer.setName(customerDetails.getName());
        customer.setContactInfo(customerDetails.getContactInfo());
        customer.setLoyaltyPoints(customerDetails.getLoyaltyPoints());
        return customerRepository.save(customer);
    }

    public void deleteCustomer(String id) {
        Customer customer = getCustomerById(id);
        customerRepository.delete(customer);
    }
}

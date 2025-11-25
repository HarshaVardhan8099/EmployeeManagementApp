package com.example.demo;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.bind.annotation.*;

import jakarta.persistence.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Optional;

@SpringBootApplication
public class DemoApplication {

    public static void main(String[] args) {
        SpringApplication.run(DemoApplication.class, args);
    }

    // Seed some sample employees on startup (optional)
    @Bean
    CommandLineRunner initData(EmployeeRepository repo) {
        return args -> {
            if (repo.count() == 0) {
                repo.save(new Employee("John", "Doe", "john@example.com", "Developer"));
                repo.save(new Employee("Jane", "Smith", "jane@example.com", "Manager"));
                repo.save(new Employee("Bob", "Johnson", "bob@example.com", "Designer"));
            }
        };
    }
}

/* ===== ENTITY ===== */

@Entity
@Table(name = "employees")
class Employee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String firstName;
    private String lastName;
    private String email;
    private String role;

    public Employee() {
    }

    public Employee(String firstName, String lastName, String email, String role) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.role = role;
    }

    // --- getters & setters ---

    public Long getId() {
        return id;
    }

    // no setter for id (optional)

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }
}

/* ===== REPOSITORY ===== */

interface EmployeeRepository extends JpaRepository<Employee, Long> {
}

/* ===== REST CONTROLLER ===== */

@CrossOrigin(origins = "*") // allow your React frontend
@RestController
@RequestMapping("/api/v1/employees")
class EmployeeController {

    private final EmployeeRepository repo;

    public EmployeeController(EmployeeRepository repo) {
        this.repo = repo;
    }

    // GET /api/v1/employees
    @GetMapping
    public List<Employee> getAll() {
        return repo.findAll();
    }

    // POST /api/v1/employees
    @PostMapping
    public Employee create(@RequestBody Employee employee) {
        return repo.save(employee);
    }

    // DELETE /api/v1/employees/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        Optional<Employee> existing = repo.findById(id);
        if (existing.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        repo.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}

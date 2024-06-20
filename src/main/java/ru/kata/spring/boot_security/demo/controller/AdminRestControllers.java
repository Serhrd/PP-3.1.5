package ru.kata.spring.boot_security.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import ru.kata.spring.boot_security.demo.entity.Role;
import ru.kata.spring.boot_security.demo.entity.User;
import ru.kata.spring.boot_security.demo.service.RoleService;
import ru.kata.spring.boot_security.demo.service.UserService;

import java.security.Principal;
import java.util.List;


@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminRestControllers {

    private final UserService us;

    private final RoleService rs;

    @Autowired
    public AdminRestControllers(UserService userServices, RoleService rs) {
        this.us = userServices;
        this.rs = rs;
    }

    @GetMapping
    public ResponseEntity<User> getAuthUser(Principal principal) {
        return new ResponseEntity<>(us.getUserByUsername(principal.getName()), HttpStatus.OK);
    }
    @GetMapping(value = "/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return new ResponseEntity<>(us.getListUsers(), HttpStatus.OK);
    }

    @GetMapping(value = "/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        return new ResponseEntity<>(us.getUser(id), HttpStatus.OK);
    }

    @PostMapping(value = "/save")
    public ResponseEntity<?> addUser(@RequestBody User newUser) {
        us.addUser(newUser);
        return ResponseEntity.status(HttpStatus.CREATED).body("User saved");
    }

    @PutMapping(value = "/edit/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody User updateUser) {
        updateUser.setId(id);
        us.updateUser(updateUser);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }


    @DeleteMapping(value = "/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        us.deleteUser(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/roles")
    public ResponseEntity<List<Role>> getAllRoles() {
        List<Role> roles = rs.getAllRoles();
        if (roles.isEmpty()) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.ok(roles);
        }
    }
}
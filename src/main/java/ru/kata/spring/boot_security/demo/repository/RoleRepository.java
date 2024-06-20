package ru.kata.spring.boot_security.demo.repository;

import org.springframework.stereotype.Repository;
import ru.kata.spring.boot_security.demo.entity.Role;

import java.util.List;
import java.util.Set;
@Repository
public interface RoleRepository {

    List<Role> findAll();

    Set<Role> findAllId(List<Long> ids);

    Role getById(Long id);

    void save(Role role);
}

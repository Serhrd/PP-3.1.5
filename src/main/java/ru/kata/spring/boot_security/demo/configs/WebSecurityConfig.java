package ru.kata.spring.boot_security.demo.configs;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.module.SimpleModule;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

import ru.kata.spring.boot_security.demo.entity.User;
import ru.kata.spring.boot_security.demo.serialization.CustomUserDeserializer;
import ru.kata.spring.boot_security.demo.service.RoleService;
import ru.kata.spring.boot_security.demo.service.UserService;

import java.util.Collections;

@Configuration
@EnableWebSecurity
public class WebSecurityConfig {

    private final SuccessUserHandler successUserHandler;
    private final UserService userServices;
    private final RoleService roleService;


    public WebSecurityConfig(SuccessUserHandler successUserHandler, UserService userServices, RoleService roleService) {
        this.successUserHandler = successUserHandler;
        this.userServices = userServices;
        this.roleService = roleService;

    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
                         http.authorizeHttpRequests(authorize -> authorize
                        .requestMatchers("/admin/**").hasRole("ADMIN")
                        .requestMatchers("/user/**").hasAnyRole("USER", "ADMIN")
                        .anyRequest().authenticated())
                        .formLogin(formLogin -> formLogin
                        .loginPage("/login")
                        .successHandler(successUserHandler)
                        .permitAll())
                                .logout(logout -> logout
                                .logoutSuccessUrl("/login?logout")
                                .permitAll());
                        http.csrf(csrf -> csrf.disable());
        return http.build();
    }

    @Bean
    @Qualifier
    public AuthenticationManager authenticationManager() {
        return new ProviderManager(Collections.singletonList(daoAuthenticationProvider()));
    }

    @Bean
    public DaoAuthenticationProvider daoAuthenticationProvider() {
        DaoAuthenticationProvider authenticationProvider = new DaoAuthenticationProvider();
        authenticationProvider.setPasswordEncoder(passwordEncoder());
        authenticationProvider.setUserDetailsService(userServices);
        return authenticationProvider;
    }

    @Bean
    public BCryptPasswordEncoder passwordEncoder() {

        return new BCryptPasswordEncoder();
    }

    @Bean
    public ObjectMapper objectMapper() {
        ObjectMapper objectMapper = new ObjectMapper();
        // Настройка ObjectMapper, например, добавление кастомных сериализаторов/десериализаторов
        // objectMapper.configure(Feature.SOME_FEATURE, true);
        SimpleModule module = new SimpleModule();
        module.addDeserializer(User.class, new CustomUserDeserializer(roleService));
        objectMapper.registerModule(module);
        return objectMapper;
    }
}

package com.example.backend.service;

import com.example.backend.config.security.UserDetailsImpl;
import com.example.backend.repository.AuthUserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService implements UserDetailsService {

    private final AuthUserRepository authUserRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        if (authUserRepository.existsByUsername(username)) {
            throw new UsernameNotFoundException("Пользователь с email: " + username + " не найден");
        }

        return UserDetailsImpl.fromAuthUser(authUserRepository.findByUsername(username));
    }
}
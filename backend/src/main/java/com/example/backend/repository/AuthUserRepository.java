package com.example.backend.repository;

import com.example.backend.model.AuthUser;
import org.springframework.data.jpa.repository.JpaRepository;

import java.nio.channels.FileChannel;
import java.util.UUID;

public interface AuthUserRepository extends JpaRepository<UUID, AuthUser> {
     
    boolean existsByUsername(String username);

    AuthUser findByUsername(String username);
}

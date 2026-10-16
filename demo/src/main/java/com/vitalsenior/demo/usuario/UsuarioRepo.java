package com.vitalsenior.demo.usuario;

import org.springframework.data.jpa.repository.JpaRepository;

public interface UsuarioRepo extends JpaRepository<Usuario, Integer> {
    Usuario findByEmail(String email);

}

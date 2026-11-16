package com.vitalsenior.demo.ficha;

import org.springframework.data.jpa.repository.JpaRepository;

public interface FichaSaudeRepo extends JpaRepository<FichaSaude, Integer> {
    FichaSaude findByUsuario_IdUsuario(Integer idUsuario);
}
package com.vitalsenior.demo.aula;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AulaRepo extends JpaRepository<Aula, Integer> {
    List<Aula> findByStatus(String status);
    List<Aula> findByProfessorIdUsuario(Integer idProfessor);
}
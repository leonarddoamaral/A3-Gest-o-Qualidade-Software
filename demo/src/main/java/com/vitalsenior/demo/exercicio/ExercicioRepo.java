package com.vitalsenior.demo.exercicio;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ExercicioRepo extends JpaRepository<Exercicio, Integer> {
    List<Exercicio> findByStatus(String status);
}
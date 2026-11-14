package com.vitalsenior.demo.local;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface LocalExercicioRepo extends JpaRepository<LocalExercicio, Integer> {
    List<LocalExercicio> findByStatus(String status);
}
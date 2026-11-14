package com.vitalsenior.demo.avaliacao;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface AvaliacaoAulaRepo extends JpaRepository<AvaliacaoAula, Integer> {
    Optional<AvaliacaoAula> findByAgendamentoIdAgendamento(Integer idAgendamento);
}
package com.vitalsenior.demo.agendamento;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AgendamentoRepo extends JpaRepository<Agendamento, Integer> {
    List<Agendamento> findByAlunoIdUsuario(Integer idAluno);
    boolean existsByAlunoIdUsuarioAndAulaIdAula(Integer idAluno, Integer idAula);
}
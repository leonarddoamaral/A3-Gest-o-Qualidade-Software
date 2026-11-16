package com.vitalsenior.demo.support;

import com.vitalsenior.demo.agendamento.Agendamento;
import com.vitalsenior.demo.aula.Aula;
import com.vitalsenior.demo.aula.DadosCadastroAula;
import com.vitalsenior.demo.local.DadosCadastroLocal;
import com.vitalsenior.demo.local.LocalExercicio;
import com.vitalsenior.demo.usuario.DadosCadastroUsuario;
import com.vitalsenior.demo.usuario.Usuario;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Fábricas de entidades usadas pelos testes unitários e de integração.
 * Passe {@code id = null} quando a entidade for persistida de verdade.
 */
public final class Fixtures {

    private Fixtures() {
    }

    public static Usuario usuario(Integer id, String nome, String email) {
        Usuario usuario = new Usuario(new DadosCadastroUsuario(
                nome, email, "hash-fake", "11999999999", LocalDate.of(1955, 3, 10), "ALUNO"));
        usuario.setIdUsuario(id);
        return usuario;
    }

    public static LocalExercicio local(Integer id, String nome) {
        LocalExercicio local = new LocalExercicio(new DadosCadastroLocal(
                nome, "Local de teste", "Rua A, 10", null, "01001-000",
                new BigDecimal("-23.55052"), new BigDecimal("-46.633308")));
        local.setIdLocal(id);
        return local;
    }

    public static Aula aula(Integer id, Usuario professor, LocalExercicio local) {
        Aula aula = new Aula(new DadosCadastroAula(
                professor.getIdUsuario(), local.getIdLocal(), "Hidroginástica", "Aula leve",
                LocalDateTime.of(2026, 12, 1, 10, 0), LocalDateTime.of(2026, 12, 1, 11, 0)),
                professor, local);
        aula.setIdAula(id);
        return aula;
    }

    public static Agendamento agendamento(Integer id, Usuario aluno, Aula aula) {
        Agendamento agendamento = new Agendamento(aluno, aula);
        agendamento.setIdAgendamento(id);
        return agendamento;
    }
}

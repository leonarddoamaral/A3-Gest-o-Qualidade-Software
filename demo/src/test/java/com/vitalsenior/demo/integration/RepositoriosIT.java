package com.vitalsenior.demo.integration;

import com.vitalsenior.demo.agendamento.Agendamento;
import com.vitalsenior.demo.aula.Aula;
import com.vitalsenior.demo.avaliacao.AvaliacaoAula;
import com.vitalsenior.demo.avaliacao.DadosCadastroAvaliacao;
import com.vitalsenior.demo.exercicio.DadosCadastroExercicio;
import com.vitalsenior.demo.exercicio.Exercicio;
import com.vitalsenior.demo.ficha.DadosCadastroFichaSaude;
import com.vitalsenior.demo.ficha.FichaSaude;
import com.vitalsenior.demo.local.LocalExercicio;
import com.vitalsenior.demo.support.Fixtures;
import com.vitalsenior.demo.usuario.Usuario;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

/** Valida as consultas derivadas dos repositórios contra o Postgres real. */
class RepositoriosIT extends IntegrationTestBase {

    @Test
    void usuarioRepoDeveBuscarPorEmail() {
        salvarUsuario("Maria", "maria@email.com");

        assertThat(usuarioRepo.findByEmail("maria@email.com")).isNotNull();
        assertThat(usuarioRepo.findByEmail("outro@email.com")).isNull();
    }

    @Test
    void aulaRepoDeveFiltrarPorStatusEPorProfessor() {
        Usuario ana = salvarUsuario("Prof. Ana", "ana@email.com");
        Usuario beto = salvarUsuario("Prof. Beto", "beto@email.com");
        LocalExercicio local = salvarLocal("Praça");
        Aula agendada = salvarAula(ana, local);
        Aula cancelada = salvarAula(beto, local);
        cancelada.setStatus("CANCELADA");
        aulaRepo.save(cancelada);

        assertThat(aulaRepo.findByStatus("AGENDADA")).extracting(Aula::getIdAula)
                .containsExactly(agendada.getIdAula());
        assertThat(aulaRepo.findByStatus("CANCELADA")).extracting(Aula::getIdAula)
                .containsExactly(cancelada.getIdAula());
        assertThat(aulaRepo.findByProfessorIdUsuario(ana.getIdUsuario())).hasSize(1);
        assertThat(aulaRepo.findByProfessorIdUsuario(beto.getIdUsuario())).hasSize(1);
    }

    @Test
    void agendamentoRepoDeveConsultarPorAlunoEVerificarExistencia() {
        Usuario professor = salvarUsuario("Prof. Ana", "ana@email.com");
        Usuario maria = salvarUsuario("Maria", "maria@email.com");
        Usuario jose = salvarUsuario("José", "jose@email.com");
        Aula aula = salvarAula(professor, salvarLocal("Praça"));
        agendamentoRepo.save(new Agendamento(maria, aula));

        assertThat(agendamentoRepo.findByAlunoIdUsuario(maria.getIdUsuario())).hasSize(1);
        assertThat(agendamentoRepo.findByAlunoIdUsuario(jose.getIdUsuario())).isEmpty();
        assertThat(agendamentoRepo.existsByAlunoIdUsuarioAndAulaIdAula(maria.getIdUsuario(), aula.getIdAula()))
                .isTrue();
        assertThat(agendamentoRepo.existsByAlunoIdUsuarioAndAulaIdAula(jose.getIdUsuario(), aula.getIdAula()))
                .isFalse();
    }

    @Test
    void avaliacaoRepoDeveBuscarPorAgendamento() {
        Usuario professor = salvarUsuario("Prof. Ana", "ana@email.com");
        Usuario aluno = salvarUsuario("Maria", "maria@email.com");
        Aula aula = salvarAula(professor, salvarLocal("Praça"));
        Agendamento agendamento = agendamentoRepo.save(new Agendamento(aluno, aula));
        avaliacaoRepo.save(new AvaliacaoAula(new DadosCadastroAvaliacao(null, 5, 2, null), agendamento));

        assertThat(avaliacaoRepo.findByAgendamentoIdAgendamento(agendamento.getIdAgendamento())).isPresent();
        assertThat(avaliacaoRepo.findByAgendamentoIdAgendamento(agendamento.getIdAgendamento() + 1000)).isEmpty();
    }

    @Test
    void exercicioELocalReposDevemFiltrarPorStatus() {
        exercicioRepo.save(new Exercicio(new DadosCadastroExercicio("A", null, "FACIL", null, null, null, "u1")));
        exercicioRepo.save(new Exercicio(new DadosCadastroExercicio("B", null, "FACIL", null, null, "INATIVO", "u2")));
        LocalExercicio inativo = Fixtures.local(null, "Fechado");
        inativo.setStatus("INATIVO");
        localRepo.save(inativo);
        salvarLocal("Aberto");

        assertThat(exercicioRepo.findByStatus("ATIVO")).extracting(Exercicio::getTitulo).containsExactly("A");
        assertThat(exercicioRepo.findByStatus("INATIVO")).extracting(Exercicio::getTitulo).containsExactly("B");
        assertThat(localRepo.findByStatus("ATIVO")).extracting(LocalExercicio::getNome).containsExactly("Aberto");
        assertThat(localRepo.findByStatus("INATIVO")).extracting(LocalExercicio::getNome).containsExactly("Fechado");
    }

    @Test
    void fichaRepoDeveBuscarPorIdDoUsuario() {
        Usuario maria = salvarUsuario("Maria", "maria@email.com");
        Usuario jose = salvarUsuario("José", "jose@email.com");
        fichaRepo.save(new FichaSaude(
                new DadosCadastroFichaSaude(false, false, false, "Contato", "11777777777", maria.getIdUsuario()),
                maria));

        assertThat(fichaRepo.findByUsuario_IdUsuario(maria.getIdUsuario())).isNotNull();
        assertThat(fichaRepo.findByUsuario_IdUsuario(jose.getIdUsuario())).isNull();
    }
}

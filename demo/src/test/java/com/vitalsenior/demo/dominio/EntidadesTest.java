package com.vitalsenior.demo.dominio;

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
import com.vitalsenior.demo.usuario.DadosCadastroUsuario;
import com.vitalsenior.demo.usuario.Usuario;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.time.LocalDate;

import static org.assertj.core.api.Assertions.assertThat;

class EntidadesTest {

    private static DadosCadastroExercicio dadosExercicio(String status) {
        return new DadosCadastroExercicio("Agachamento", "Fortalece pernas", "FACIL",
                "Mantenha a coluna reta", "Use apoio", status, "V2_5G2Y3kXw");
    }

    @Test
    void exercicioSemStatusDeveNascerAtivo() {
        Exercicio exercicio = new Exercicio(dadosExercicio(null));

        assertThat(exercicio.getStatus()).isEqualTo("ATIVO");
        assertThat(exercicio.getTitulo()).isEqualTo("Agachamento");
        assertThat(exercicio.getUrl()).isEqualTo("V2_5G2Y3kXw");
    }

    @Test
    void exercicioComStatusInformadoDeveManterOStatus() {
        Exercicio exercicio = new Exercicio(dadosExercicio("INATIVO"));

        assertThat(exercicio.getStatus()).isEqualTo("INATIVO");
    }

    @Test
    void localSemStatusDeveNascerAtivoEPreservarCoordenadas() {
        LocalExercicio local = Fixtures.local(null, "Praça da Saúde");

        assertThat(local.getStatus()).isEqualTo("ATIVO");
        assertThat(local.getLatitude()).isEqualByComparingTo(new BigDecimal("-23.55052"));
        assertThat(local.getLongitude()).isEqualByComparingTo(new BigDecimal("-46.633308"));
    }

    @Test
    void aulaDeveNascerAgendadaComProfessorELocal() {
        Usuario professor = Fixtures.usuario(1, "Prof. Ana", "ana@email.com");
        LocalExercicio local = Fixtures.local(2, "Praça da Saúde");

        Aula aula = Fixtures.aula(null, professor, local);

        assertThat(aula.getStatus()).isEqualTo("AGENDADA");
        assertThat(aula.getProfessor()).isSameAs(professor);
        assertThat(aula.getLocal()).isSameAs(local);
        assertThat(aula.getMotivoCancelamento()).isNull();
    }

    @Test
    void agendamentoDeveNascerConfirmadoComPresencaPendente() {
        Usuario aluno = Fixtures.usuario(1, "Maria", "maria@email.com");
        Aula aula = Fixtures.aula(10, Fixtures.usuario(2, "Prof. Ana", "ana@email.com"), Fixtures.local(3, "Praça"));

        Agendamento agendamento = new Agendamento(aluno, aula);

        assertThat(agendamento.getStatusAgendamento()).isEqualTo("CONFIRMADO");
        assertThat(agendamento.getStatusPresenca()).isEqualTo("PENDENTE");
        assertThat(agendamento.getDataSolicitacao()).isNotNull();
        assertThat(agendamento.getAluno()).isSameAs(aluno);
        assertThat(agendamento.getAula()).isSameAs(aula);
    }

    @Test
    void avaliacaoDeveCopiarNotasERegistrarDataDaAvaliacao() {
        Agendamento agendamento = new Agendamento();

        AvaliacaoAula avaliacao = new AvaliacaoAula(
                new DadosCadastroAvaliacao(1, 5, 2, "Piso escorregadio"), agendamento);

        assertThat(avaliacao.getAgendamento()).isSameAs(agendamento);
        assertThat(avaliacao.getAvaliacaoExperiencia()).isEqualTo(5);
        assertThat(avaliacao.getAvaliacaoDificuldade()).isEqualTo(2);
        assertThat(avaliacao.getRelatoProblema()).isEqualTo("Piso escorregadio");
        assertThat(avaliacao.getDataAvaliacao()).isNotNull();
    }

    @Test
    void usuarioDeveCopiarTodosOsCamposDoCadastro() {
        DadosCadastroUsuario dados = new DadosCadastroUsuario(
                "Maria Silva", "maria@email.com", "senha123", "11999999999",
                LocalDate.of(1950, 5, 10), "ALUNO");

        Usuario usuario = new Usuario(dados);

        assertThat(usuario.getNome()).isEqualTo("Maria Silva");
        assertThat(usuario.getEmail()).isEqualTo("maria@email.com");
        assertThat(usuario.getSenhaHash()).isEqualTo("senha123");
        assertThat(usuario.getTelefone()).isEqualTo("11999999999");
        assertThat(usuario.getDataNascimento()).isEqualTo(LocalDate.of(1950, 5, 10));
        assertThat(usuario.getTipoPerfil()).isEqualTo("ALUNO");
        assertThat(usuario.getIdUsuario()).isNull();
    }

    @Test
    void fichaDeSaudeDeveCopiarDadosEVincularUsuario() {
        Usuario usuario = Fixtures.usuario(7, "Maria", "maria@email.com");
        DadosCadastroFichaSaude dados = new DadosCadastroFichaSaude(
                false, true, true, "José", "11888888888", 7);

        FichaSaude ficha = new FichaSaude(dados, usuario);

        assertThat(ficha.getHistoricoQuedas()).isTrue();
        assertThat(ficha.getDoresPeitoTontura()).isFalse();
        assertThat(ficha.getNomeContatoEmergencia()).isEqualTo("José");
        assertThat(ficha.getUsuario()).isSameAs(usuario);
        assertThat(new DadosCadastroFichaSaude(ficha).idUsuario()).isEqualTo(7);
    }
}

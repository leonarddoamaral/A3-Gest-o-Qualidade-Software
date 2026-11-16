package com.vitalsenior.demo.dominio;

import com.vitalsenior.demo.agendamento.DadosCadastroAgendamento;
import com.vitalsenior.demo.aula.DadosCadastroAula;
import com.vitalsenior.demo.avaliacao.DadosCadastroAvaliacao;
import com.vitalsenior.demo.exercicio.DadosCadastroExercicio;
import com.vitalsenior.demo.ficha.DadosCadastroFichaSaude;
import com.vitalsenior.demo.local.DadosCadastroLocal;
import com.vitalsenior.demo.usuario.DadosCadastroUsuario;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;

/** Valida as regras de Bean Validation dos DTOs de entrada, sem subir o Spring. */
class ValidacaoDadosTest {

    private static ValidatorFactory factory;
    private static Validator validator;

    @BeforeAll
    static void iniciar() {
        factory = Validation.buildDefaultValidatorFactory();
        validator = factory.getValidator();
    }

    @AfterAll
    static void encerrar() {
        factory.close();
    }

    private static List<String> camposInvalidos(Set<? extends ConstraintViolation<?>> violacoes) {
        return violacoes.stream().map(v -> v.getPropertyPath().toString()).distinct().sorted().toList();
    }

    @Test
    void usuarioValidoNaoGeraViolacoes() {
        var dados = new DadosCadastroUsuario("Maria", "maria@email.com", "senha123",
                "11999999999", LocalDate.of(1950, 5, 10), "ALUNO");

        assertThat(validator.validate(dados)).isEmpty();
    }

    @Test
    void usuarioComCamposEmBrancoOuNulosDeveSerInvalido() {
        var dados = new DadosCadastroUsuario("", " ", null, "", null, "");

        assertThat(camposInvalidos(validator.validate(dados)))
                .containsExactly("dataNascimento", "email", "nome", "senhaHash", "telefone", "tipoPerfil");
    }

    @Test
    void avaliacaoComNotasForaDoIntervaloDeveSerInvalida() {
        var dados = new DadosCadastroAvaliacao(1, 0, 6, null);

        assertThat(camposInvalidos(validator.validate(dados)))
                .containsExactly("avaliacaoDificuldade", "avaliacaoExperiencia");
    }

    @Test
    void avaliacaoComNotasNosLimitesDeveSerValida() {
        assertThat(validator.validate(new DadosCadastroAvaliacao(1, 1, 5, null))).isEmpty();
    }

    @Test
    void avaliacaoSemAgendamentoDeveSerInvalida() {
        var dados = new DadosCadastroAvaliacao(null, 3, 3, "ok");

        assertThat(camposInvalidos(validator.validate(dados))).containsExactly("idAgendamento");
    }

    @Test
    void agendamentoExigeAlunoEAula() {
        assertThat(camposInvalidos(validator.validate(new DadosCadastroAgendamento(null, null))))
                .containsExactly("idAluno", "idAula");
        assertThat(validator.validate(new DadosCadastroAgendamento(1, 2))).isEmpty();
    }

    @Test
    void aulaExigeProfessorLocalTituloEHorarios() {
        var dados = new DadosCadastroAula(null, null, " ", null, null, null);

        assertThat(camposInvalidos(validator.validate(dados)))
                .containsExactly("dataHoraFinal", "dataHoraInicio", "idLocal", "idProfessor", "titulo");
    }

    @Test
    void aulaComDescricaoOpcionalDeveSerValida() {
        var dados = new DadosCadastroAula(1, 2, "Alongamento", null,
                LocalDateTime.of(2026, 12, 1, 10, 0), LocalDateTime.of(2026, 12, 1, 11, 0));

        assertThat(validator.validate(dados)).isEmpty();
    }

    @Test
    void localExigeNomeELatitudeELongitude() {
        var dados = new DadosCadastroLocal("", null, null, null, null, null, null);

        assertThat(camposInvalidos(validator.validate(dados)))
                .containsExactly("latitude", "longitude", "nome");
        assertThat(validator.validate(new DadosCadastroLocal("Praça", null, null, null, null,
                new BigDecimal("-23.5"), new BigDecimal("-46.6")))).isEmpty();
    }

    @Test
    void exercicioExigeTituloNivelEUrl() {
        var dados = new DadosCadastroExercicio("", null, "", null, null, null, "");

        assertThat(camposInvalidos(validator.validate(dados)))
                .containsExactly("nivelDificuldade", "titulo", "url");
    }

    @Test
    void fichaDeSaudeExigeTodasAsRespostasEContatoDeEmergencia() {
        var dados = new DadosCadastroFichaSaude(null, null, null, "", "", null);

        assertThat(camposInvalidos(validator.validate(dados)))
                .containsExactly("doresPeitoTontura", "historicoQuedas", "idUsuario",
                        "nomeContatoEmergencia", "problemasArticulacoes", "telefoneEmergencia");
    }
}

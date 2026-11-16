package com.vitalsenior.demo.integration;

import com.jayway.jsonpath.JsonPath;
import com.vitalsenior.demo.agendamento.Agendamento;
import com.vitalsenior.demo.aula.Aula;
import com.vitalsenior.demo.usuario.Usuario;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class AgendamentoIT extends IntegrationTestBase {

    private Usuario aluno;
    private Aula aula;

    @BeforeEach
    void criarCenario() {
        Usuario professor = salvarUsuario("Prof. Ana", "ana@email.com");
        aluno = salvarUsuario("Maria", "maria@email.com");
        aula = salvarAula(professor, salvarLocal("Praça da Saúde"));
    }

    private String pedido(Integer idAluno, Integer idAula) {
        return "{\"idAluno\":%d,\"idAula\":%d}".formatted(idAluno, idAula);
    }

    @Test
    void agendarDevePersistirAgendamentoConfirmado() throws Exception {
        mockMvc.perform(post("/vitalsenior/agendamentos").contentType(MediaType.APPLICATION_JSON)
                        .content(pedido(aluno.getIdUsuario(), aula.getIdAula())))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.idAgendamento").isNumber())
                .andExpect(jsonPath("$.statusAgendamento").value("CONFIRMADO"))
                .andExpect(jsonPath("$.statusPresenca").value("PENDENTE"))
                .andExpect(jsonPath("$.aula.titulo").value("Hidroginástica"));

        assertThat(agendamentoRepo.existsByAlunoIdUsuarioAndAulaIdAula(aluno.getIdUsuario(), aula.getIdAula()))
                .isTrue();
    }

    @Test
    void agendarDuasVezesAMesmaAulaDeveRetornar400() throws Exception {
        String corpo = pedido(aluno.getIdUsuario(), aula.getIdAula());

        mockMvc.perform(post("/vitalsenior/agendamentos").contentType(MediaType.APPLICATION_JSON).content(corpo))
                .andExpect(status().isCreated());
        mockMvc.perform(post("/vitalsenior/agendamentos").contentType(MediaType.APPLICATION_JSON).content(corpo))
                .andExpect(status().isBadRequest());

        assertThat(agendamentoRepo.count()).isEqualTo(1);
    }

    @Test
    void agendarComAlunoInexistenteDeveFalharENaoPersistir() {
        assertThatThrownBy(() -> mockMvc.perform(post("/vitalsenior/agendamentos")
                .contentType(MediaType.APPLICATION_JSON).content(pedido(9999, aula.getIdAula()))))
                .hasRootCauseMessage("Aluno não encontrado");

        assertThat(agendamentoRepo.count()).isZero();
    }

    @Test
    void listarPorAlunoDeveRetornarSomenteOsAgendamentosDoAluno() throws Exception {
        Usuario outroAluno = salvarUsuario("José", "jose@email.com");
        agendamentoRepo.save(new Agendamento(aluno, aula));
        agendamentoRepo.save(new Agendamento(outroAluno, aula));

        mockMvc.perform(get("/vitalsenior/agendamentos/aluno/" + aluno.getIdUsuario()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].aula.idAula").value(aula.getIdAula()));
    }

    @Test
    void cancelarDeveMarcarAgendamentoComoCanceladoNoBanco() throws Exception {
        Agendamento agendamento = agendamentoRepo.save(new Agendamento(aluno, aula));

        mockMvc.perform(delete("/vitalsenior/agendamentos/" + agendamento.getIdAgendamento()))
                .andExpect(status().isNoContent());

        Agendamento atualizado = agendamentoRepo.findById(agendamento.getIdAgendamento()).orElseThrow();
        assertThat(atualizado.getStatusAgendamento()).isEqualTo("CANCELADO");
    }

    @Test
    void cancelarAgendamentoInexistenteDeveRetornar404() throws Exception {
        mockMvc.perform(delete("/vitalsenior/agendamentos/9999"))
                .andExpect(status().isNotFound());
    }

    @Test
    void jornadaCompletaAgendarEAvaliarAAula() throws Exception {
        String respostaAgendamento = mockMvc.perform(post("/vitalsenior/agendamentos")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(pedido(aluno.getIdUsuario(), aula.getIdAula())))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString();
        Integer idAgendamento = JsonPath.read(respostaAgendamento, "$.idAgendamento");

        String avaliacao = """
                {"idAgendamento":%d,"avaliacaoExperiencia":5,"avaliacaoDificuldade":2,"relatoProblema":"Nada a relatar"}
                """.formatted(idAgendamento);

        mockMvc.perform(post("/vitalsenior/avaliacoes").contentType(MediaType.APPLICATION_JSON).content(avaliacao))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.idAgendamento").value(idAgendamento));

        mockMvc.perform(get("/vitalsenior/avaliacoes/agendamento/" + idAgendamento))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.avaliacaoExperiencia").value(5))
                .andExpect(jsonPath("$.avaliacaoDificuldade").value(2));
    }
}

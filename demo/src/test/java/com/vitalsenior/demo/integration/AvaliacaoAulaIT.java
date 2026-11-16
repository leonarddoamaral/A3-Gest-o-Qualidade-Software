package com.vitalsenior.demo.integration;

import com.vitalsenior.demo.agendamento.Agendamento;
import com.vitalsenior.demo.avaliacao.AvaliacaoAula;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class AvaliacaoAulaIT extends IntegrationTestBase {

    private Agendamento agendamento;

    @BeforeEach
    void criarCenario() {
        var professor = salvarUsuario("Prof. Ana", "ana@email.com");
        var aluno = salvarUsuario("Maria", "maria@email.com");
        var aula = salvarAula(professor, salvarLocal("Praça da Saúde"));
        agendamento = agendamentoRepo.save(new Agendamento(aluno, aula));
    }

    private String corpo(Integer idAgendamento, int experiencia, int dificuldade) {
        return "{\"idAgendamento\":%d,\"avaliacaoExperiencia\":%d,\"avaliacaoDificuldade\":%d,\"relatoProblema\":\"ok\"}"
                .formatted(idAgendamento, experiencia, dificuldade);
    }

    @Test
    void avaliarDevePersistirAvaliacaoVinculadaAoAgendamento() throws Exception {
        mockMvc.perform(post("/vitalsenior/avaliacoes").contentType(MediaType.APPLICATION_JSON)
                        .content(corpo(agendamento.getIdAgendamento(), 4, 3)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.idAvaliacao").isNumber());

        AvaliacaoAula salva = avaliacaoRepo.findByAgendamentoIdAgendamento(agendamento.getIdAgendamento())
                .orElseThrow();
        assertThat(salva.getAvaliacaoExperiencia()).isEqualTo(4);
        assertThat(salva.getAvaliacaoDificuldade()).isEqualTo(3);
        assertThat(salva.getDataAvaliacao()).isNotNull();
    }

    @Test
    void avaliarOMesmoAgendamentoDuasVezesDeveRetornar400() throws Exception {
        String corpo = corpo(agendamento.getIdAgendamento(), 5, 1);

        mockMvc.perform(post("/vitalsenior/avaliacoes").contentType(MediaType.APPLICATION_JSON).content(corpo))
                .andExpect(status().isCreated());
        mockMvc.perform(post("/vitalsenior/avaliacoes").contentType(MediaType.APPLICATION_JSON).content(corpo))
                .andExpect(status().isBadRequest());

        assertThat(avaliacaoRepo.count()).isEqualTo(1);
    }

    @Test
    void avaliarComNotasForaDoIntervaloDeveRetornar400() throws Exception {
        mockMvc.perform(post("/vitalsenior/avaliacoes").contentType(MediaType.APPLICATION_JSON)
                        .content(corpo(agendamento.getIdAgendamento(), 6, 3)))
                .andExpect(status().isBadRequest());
        mockMvc.perform(post("/vitalsenior/avaliacoes").contentType(MediaType.APPLICATION_JSON)
                        .content(corpo(agendamento.getIdAgendamento(), 3, 0)))
                .andExpect(status().isBadRequest());

        assertThat(avaliacaoRepo.count()).isZero();
    }

    @Test
    void avaliarAgendamentoInexistenteDeveFalhar() {
        assertThatThrownBy(() -> mockMvc.perform(post("/vitalsenior/avaliacoes")
                .contentType(MediaType.APPLICATION_JSON).content(corpo(9999, 3, 3))))
                .hasRootCauseMessage("Agendamento não encontrado");
    }

    @Test
    void buscarPorAgendamentoSemAvaliacaoDeveRetornar404() throws Exception {
        mockMvc.perform(get("/vitalsenior/avaliacoes/agendamento/" + agendamento.getIdAgendamento()))
                .andExpect(status().isNotFound());
    }
}

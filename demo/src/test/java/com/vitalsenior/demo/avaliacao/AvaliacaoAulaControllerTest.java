package com.vitalsenior.demo.avaliacao;

import com.vitalsenior.demo.agendamento.Agendamento;
import com.vitalsenior.demo.agendamento.AgendamentoRepo;
import com.vitalsenior.demo.support.Fixtures;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
class AvaliacaoAulaControllerTest {

    private static final String AVALIACAO = """
            {"idAgendamento":7,"avaliacaoExperiencia":5,"avaliacaoDificuldade":2,"relatoProblema":"Piso molhado"}
            """;

    @Mock
    private AvaliacaoAulaRepo avaliacaoRepo;
    @Mock
    private AgendamentoRepo agendamentoRepo;
    @InjectMocks
    private AvaliacaoAulaController controller;

    private MockMvc mockMvc;
    private Agendamento agendamento;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(controller).build();
        var aula = Fixtures.aula(10, Fixtures.usuario(2, "Prof. Ana", "ana@email.com"), Fixtures.local(3, "Praça"));
        agendamento = Fixtures.agendamento(7, Fixtures.usuario(1, "Maria", "maria@email.com"), aula);
    }

    @Test
    void avaliarDeveSalvarAvaliacaoDoAgendamento() throws Exception {
        when(avaliacaoRepo.findByAgendamentoIdAgendamento(7)).thenReturn(Optional.empty());
        when(agendamentoRepo.findById(7)).thenReturn(Optional.of(agendamento));

        mockMvc.perform(post("/vitalsenior/avaliacoes").contentType(MediaType.APPLICATION_JSON).content(AVALIACAO))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.idAgendamento").value(7))
                .andExpect(jsonPath("$.avaliacaoExperiencia").value(5))
                .andExpect(jsonPath("$.avaliacaoDificuldade").value(2))
                .andExpect(jsonPath("$.relatoProblema").value("Piso molhado"));

        ArgumentCaptor<AvaliacaoAula> salva = ArgumentCaptor.forClass(AvaliacaoAula.class);
        verify(avaliacaoRepo).save(salva.capture());
        assertThat(salva.getValue().getAgendamento()).isSameAs(agendamento);
        assertThat(salva.getValue().getDataAvaliacao()).isNotNull();
    }

    @Test
    void avaliarAgendamentoJaAvaliadoDeveRetornar400() throws Exception {
        when(avaliacaoRepo.findByAgendamentoIdAgendamento(7))
                .thenReturn(Optional.of(new AvaliacaoAula()));

        String corpo = mockMvc.perform(post("/vitalsenior/avaliacoes")
                        .contentType(MediaType.APPLICATION_JSON).content(AVALIACAO))
                .andExpect(status().isBadRequest())
                .andReturn().getResponse().getContentAsString();

        assertThat(corpo).contains("avaliado");
        verify(avaliacaoRepo, never()).save(any());
        verifyNoInteractions(agendamentoRepo);
    }

    @Test
    void avaliarAgendamentoInexistenteDeveFalhar() {
        when(avaliacaoRepo.findByAgendamentoIdAgendamento(7)).thenReturn(Optional.empty());
        when(agendamentoRepo.findById(7)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> mockMvc.perform(post("/vitalsenior/avaliacoes")
                .contentType(MediaType.APPLICATION_JSON).content(AVALIACAO)))
                .hasRootCauseMessage("Agendamento não encontrado");

        verify(avaliacaoRepo, never()).save(any());
    }

    @Test
    void avaliarComNotaAcimaDeCincoDeveRetornar400() throws Exception {
        String notaInvalida = """
                {"idAgendamento":7,"avaliacaoExperiencia":6,"avaliacaoDificuldade":3}
                """;

        mockMvc.perform(post("/vitalsenior/avaliacoes").contentType(MediaType.APPLICATION_JSON).content(notaInvalida))
                .andExpect(status().isBadRequest());

        verifyNoInteractions(avaliacaoRepo, agendamentoRepo);
    }

    @Test
    void avaliarComNotaZeroDeveRetornar400() throws Exception {
        String notaInvalida = """
                {"idAgendamento":7,"avaliacaoExperiencia":3,"avaliacaoDificuldade":0}
                """;

        mockMvc.perform(post("/vitalsenior/avaliacoes").contentType(MediaType.APPLICATION_JSON).content(notaInvalida))
                .andExpect(status().isBadRequest());

        verifyNoInteractions(avaliacaoRepo, agendamentoRepo);
    }

    @Test
    void buscarPorAgendamentoExistenteDeveRetornar200() throws Exception {
        var avaliacao = new AvaliacaoAula(new DadosCadastroAvaliacao(7, 4, 3, null), agendamento);
        when(avaliacaoRepo.findByAgendamentoIdAgendamento(7)).thenReturn(Optional.of(avaliacao));

        mockMvc.perform(get("/vitalsenior/avaliacoes/agendamento/7"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.idAgendamento").value(7))
                .andExpect(jsonPath("$.avaliacaoExperiencia").value(4));
    }

    @Test
    void buscarPorAgendamentoSemAvaliacaoDeveRetornar404() throws Exception {
        when(avaliacaoRepo.findByAgendamentoIdAgendamento(99)).thenReturn(Optional.empty());

        mockMvc.perform(get("/vitalsenior/avaliacoes/agendamento/99"))
                .andExpect(status().isNotFound());
    }
}

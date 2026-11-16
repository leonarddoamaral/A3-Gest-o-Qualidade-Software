package com.vitalsenior.demo.agendamento;

import com.vitalsenior.demo.aula.Aula;
import com.vitalsenior.demo.aula.AulaRepo;
import com.vitalsenior.demo.support.Fixtures;
import com.vitalsenior.demo.usuario.Usuario;
import com.vitalsenior.demo.usuario.UsuarioRepo;
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

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
class AgendamentoControllerTest {

    private static final String PEDIDO = "{\"idAluno\":1,\"idAula\":10}";

    @Mock
    private AgendamentoRepo agendamentoRepo;
    @Mock
    private UsuarioRepo usuarioRepo;
    @Mock
    private AulaRepo aulaRepo;
    @InjectMocks
    private AgendamentoController controller;

    private MockMvc mockMvc;
    private Usuario aluno;
    private Aula aula;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(controller).build();
        aluno = Fixtures.usuario(1, "Maria", "maria@email.com");
        aula = Fixtures.aula(10, Fixtures.usuario(2, "Prof. Ana", "ana@email.com"), Fixtures.local(3, "Praça da Saúde"));
    }

    @Test
    void agendarDeveCriarAgendamentoConfirmadoComPresencaPendente() throws Exception {
        when(usuarioRepo.findById(1)).thenReturn(Optional.of(aluno));
        when(aulaRepo.findById(10)).thenReturn(Optional.of(aula));

        mockMvc.perform(post("/vitalsenior/agendamentos").contentType(MediaType.APPLICATION_JSON).content(PEDIDO))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.statusAgendamento").value("CONFIRMADO"))
                .andExpect(jsonPath("$.statusPresenca").value("PENDENTE"))
                .andExpect(jsonPath("$.aula.idAula").value(10))
                .andExpect(jsonPath("$.aula.titulo").value("Hidroginástica"));

        ArgumentCaptor<Agendamento> salvo = ArgumentCaptor.forClass(Agendamento.class);
        verify(agendamentoRepo).save(salvo.capture());
        assertThat(salvo.getValue().getAluno()).isSameAs(aluno);
        assertThat(salvo.getValue().getAula()).isSameAs(aula);
    }

    @Test
    void agendarDuplicadoDeveRetornar400SemSalvar() throws Exception {
        when(agendamentoRepo.existsByAlunoIdUsuarioAndAulaIdAula(1, 10)).thenReturn(true);

        String corpo = mockMvc.perform(post("/vitalsenior/agendamentos")
                        .contentType(MediaType.APPLICATION_JSON).content(PEDIDO))
                .andExpect(status().isBadRequest())
                .andReturn().getResponse().getContentAsString();

        assertThat(corpo).contains("agendado");
        verify(agendamentoRepo, never()).save(any());
        verifyNoInteractions(usuarioRepo, aulaRepo);
    }

    @Test
    void agendarComAlunoInexistenteDeveFalhar() {
        when(usuarioRepo.findById(1)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> mockMvc.perform(post("/vitalsenior/agendamentos")
                .contentType(MediaType.APPLICATION_JSON).content(PEDIDO)))
                .hasRootCauseMessage("Aluno não encontrado");

        verify(agendamentoRepo, never()).save(any());
    }

    @Test
    void agendarComAulaInexistenteDeveFalhar() {
        when(usuarioRepo.findById(1)).thenReturn(Optional.of(aluno));
        when(aulaRepo.findById(10)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> mockMvc.perform(post("/vitalsenior/agendamentos")
                .contentType(MediaType.APPLICATION_JSON).content(PEDIDO)))
                .hasRootCauseMessage("Aula não encontrada");

        verify(agendamentoRepo, never()).save(any());
    }

    @Test
    void agendarSemIdDaAulaDeveRetornar400() throws Exception {
        mockMvc.perform(post("/vitalsenior/agendamentos").contentType(MediaType.APPLICATION_JSON)
                        .content("{\"idAluno\":1}"))
                .andExpect(status().isBadRequest());

        verifyNoInteractions(agendamentoRepo, usuarioRepo, aulaRepo);
    }

    @Test
    void listarPorAlunoDeveRetornarOsAgendamentosDoAluno() throws Exception {
        when(agendamentoRepo.findByAlunoIdUsuario(1)).thenReturn(List.of(Fixtures.agendamento(5, aluno, aula)));

        mockMvc.perform(get("/vitalsenior/agendamentos/aluno/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].idAgendamento").value(5))
                .andExpect(jsonPath("$[0].aula.titulo").value("Hidroginástica"));
    }

    @Test
    void listarPorAlunoSemAgendamentosDeveRetornarListaVazia() throws Exception {
        when(agendamentoRepo.findByAlunoIdUsuario(1)).thenReturn(List.of());

        mockMvc.perform(get("/vitalsenior/agendamentos/aluno/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(0));
    }

    @Test
    void cancelarDeveMarcarAgendamentoComoCancelado() throws Exception {
        Agendamento agendamento = Fixtures.agendamento(5, aluno, aula);
        when(agendamentoRepo.findById(5)).thenReturn(Optional.of(agendamento));

        mockMvc.perform(delete("/vitalsenior/agendamentos/5"))
                .andExpect(status().isNoContent());

        assertThat(agendamento.getStatusAgendamento()).isEqualTo("CANCELADO");
        verify(agendamentoRepo).save(agendamento);
    }

    @Test
    void cancelarAgendamentoInexistenteDeveRetornar404() throws Exception {
        when(agendamentoRepo.findById(99)).thenReturn(Optional.empty());

        mockMvc.perform(delete("/vitalsenior/agendamentos/99"))
                .andExpect(status().isNotFound());

        verify(agendamentoRepo, never()).save(any());
    }
}

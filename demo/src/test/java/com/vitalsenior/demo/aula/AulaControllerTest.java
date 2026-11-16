package com.vitalsenior.demo.aula;

import com.vitalsenior.demo.local.LocalExercicio;
import com.vitalsenior.demo.local.LocalExercicioRepo;
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
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
class AulaControllerTest {

    private static final String NOVA_AULA = """
            {"idProfessor":1,"idLocal":2,"titulo":"Alongamento","descricao":"Aula leve",
             "dataHoraInicio":"2026-12-01T10:00:00","dataHoraFinal":"2026-12-01T11:00:00"}
            """;

    @Mock
    private AulaRepo aulaRepo;
    @Mock
    private UsuarioRepo usuarioRepo;
    @Mock
    private LocalExercicioRepo localRepo;
    @InjectMocks
    private AulaController controller;

    private MockMvc mockMvc;
    private Usuario professor;
    private LocalExercicio local;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(controller).build();
        professor = Fixtures.usuario(1, "Prof. Ana", "ana@email.com");
        local = Fixtures.local(2, "Praça da Saúde");
    }

    @Test
    void cadastrarDeveCriarAulaAgendada() throws Exception {
        when(usuarioRepo.findById(1)).thenReturn(Optional.of(professor));
        when(localRepo.findById(2)).thenReturn(Optional.of(local));

        mockMvc.perform(post("/vitalsenior/aulas").contentType(MediaType.APPLICATION_JSON).content(NOVA_AULA))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.titulo").value("Alongamento"))
                .andExpect(jsonPath("$.status").value("AGENDADA"))
                .andExpect(jsonPath("$.nomeProfessor").value("Prof. Ana"))
                .andExpect(jsonPath("$.local.nome").value("Praça da Saúde"));

        ArgumentCaptor<Aula> salva = ArgumentCaptor.forClass(Aula.class);
        verify(aulaRepo).save(salva.capture());
        assertThat(salva.getValue().getProfessor()).isSameAs(professor);
        assertThat(salva.getValue().getLocal()).isSameAs(local);
    }

    @Test
    void cadastrarComProfessorInexistenteDeveFalhar() {
        when(usuarioRepo.findById(1)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> mockMvc.perform(post("/vitalsenior/aulas")
                .contentType(MediaType.APPLICATION_JSON).content(NOVA_AULA)))
                .hasRootCauseMessage("Professor não encontrado");

        verify(aulaRepo, never()).save(any());
    }

    @Test
    void cadastrarComLocalInexistenteDeveFalhar() {
        when(usuarioRepo.findById(1)).thenReturn(Optional.of(professor));
        when(localRepo.findById(2)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> mockMvc.perform(post("/vitalsenior/aulas")
                .contentType(MediaType.APPLICATION_JSON).content(NOVA_AULA)))
                .hasRootCauseMessage("Local não encontrado");

        verify(aulaRepo, never()).save(any());
    }

    @Test
    void cadastrarSemTituloDeveRetornar400() throws Exception {
        String semTitulo = """
                {"idProfessor":1,"idLocal":2,"dataHoraInicio":"2026-12-01T10:00:00","dataHoraFinal":"2026-12-01T11:00:00"}
                """;

        mockMvc.perform(post("/vitalsenior/aulas").contentType(MediaType.APPLICATION_JSON).content(semTitulo))
                .andExpect(status().isBadRequest());

        verifyNoInteractions(aulaRepo, usuarioRepo, localRepo);
    }

    @Test
    void listarTodasDeveRetornarAsAulas() throws Exception {
        when(aulaRepo.findAll()).thenReturn(List.of(
                Fixtures.aula(10, professor, local), Fixtures.aula(11, professor, local)));

        mockMvc.perform(get("/vitalsenior/aulas"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].idAula").value(10))
                .andExpect(jsonPath("$[1].idAula").value(11));
    }

    @Test
    void buscarPorIdExistenteDeveRetornar200() throws Exception {
        when(aulaRepo.findById(10)).thenReturn(Optional.of(Fixtures.aula(10, professor, local)));

        mockMvc.perform(get("/vitalsenior/aulas/10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.idAula").value(10));
    }

    @Test
    void buscarPorIdInexistenteDeveRetornar404() throws Exception {
        when(aulaRepo.findById(99)).thenReturn(Optional.empty());

        mockMvc.perform(get("/vitalsenior/aulas/99"))
                .andExpect(status().isNotFound());
    }

    @Test
    void cancelarDeveMarcarAulaComoCanceladaEGuardarOMotivo() throws Exception {
        Aula aula = Fixtures.aula(10, professor, local);
        when(aulaRepo.findById(10)).thenReturn(Optional.of(aula));

        mockMvc.perform(patch("/vitalsenior/aulas/10/cancelar")
                        .contentType(MediaType.TEXT_PLAIN).content("Chuva forte"))
                .andExpect(status().isNoContent());

        assertThat(aula.getStatus()).isEqualTo("CANCELADA");
        assertThat(aula.getMotivoCancelamento()).isEqualTo("Chuva forte");
        verify(aulaRepo).save(aula);
    }

    @Test
    void cancelarAulaInexistenteDeveRetornar404() throws Exception {
        when(aulaRepo.findById(99)).thenReturn(Optional.empty());

        mockMvc.perform(patch("/vitalsenior/aulas/99/cancelar")
                        .contentType(MediaType.TEXT_PLAIN).content("Sem motivo"))
                .andExpect(status().isNotFound());

        verify(aulaRepo, never()).save(any());
    }
}

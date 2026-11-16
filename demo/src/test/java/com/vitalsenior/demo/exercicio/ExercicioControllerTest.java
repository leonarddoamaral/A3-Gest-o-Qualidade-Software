package com.vitalsenior.demo.exercicio;

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
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
class ExercicioControllerTest {

    @Mock
    private ExercicioRepo repo;
    @InjectMocks
    private ExercicioController controller;

    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(controller).build();
    }

    private static Exercicio exercicio(int id, String titulo) {
        Exercicio exercicio = new Exercicio(new DadosCadastroExercicio(
                titulo, "Descrição", "FACIL", "Instruções", "Precauções", null, "V2_5G2Y3kXw"));
        exercicio.setIdExercicio(id);
        return exercicio;
    }

    @Test
    void cadastrarSemStatusDeveSalvarComoAtivo() throws Exception {
        String corpo = """
                {"titulo":"Agachamento","nivelDificuldade":"FACIL","url":"V2_5G2Y3kXw"}
                """;

        mockMvc.perform(post("/vitalsenior/exercicios").contentType(MediaType.APPLICATION_JSON).content(corpo))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.titulo").value("Agachamento"))
                .andExpect(jsonPath("$.status").value("ATIVO"))
                .andExpect(jsonPath("$.url").value("V2_5G2Y3kXw"));

        ArgumentCaptor<Exercicio> salvo = ArgumentCaptor.forClass(Exercicio.class);
        verify(repo).save(salvo.capture());
        assertThat(salvo.getValue().getNivelDificuldade()).isEqualTo("FACIL");
    }

    @Test
    void cadastrarSemUrlDeveRetornar400() throws Exception {
        String corpo = "{\"titulo\":\"Agachamento\",\"nivelDificuldade\":\"FACIL\"}";

        mockMvc.perform(post("/vitalsenior/exercicios").contentType(MediaType.APPLICATION_JSON).content(corpo))
                .andExpect(status().isBadRequest());

        verifyNoInteractions(repo);
    }

    @Test
    void listarTodosDeveRetornarOsExercicios() throws Exception {
        when(repo.findAll()).thenReturn(List.of(exercicio(1, "Agachamento"), exercicio(2, "Alongamento")));

        mockMvc.perform(get("/vitalsenior/exercicios"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[1].titulo").value("Alongamento"));
    }

    @Test
    void buscarPorIdExistenteDeveRetornar200() throws Exception {
        when(repo.findById(1)).thenReturn(Optional.of(exercicio(1, "Agachamento")));

        mockMvc.perform(get("/vitalsenior/exercicios/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.idExercicio").value(1));
    }

    @Test
    void buscarPorIdInexistenteDeveRetornar404() throws Exception {
        when(repo.findById(99)).thenReturn(Optional.empty());

        mockMvc.perform(get("/vitalsenior/exercicios/99"))
                .andExpect(status().isNotFound());
    }
}

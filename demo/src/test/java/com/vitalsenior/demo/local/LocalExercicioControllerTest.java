package com.vitalsenior.demo.local;

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

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
class LocalExercicioControllerTest {

    @Mock
    private LocalExercicioRepo repo;
    @InjectMocks
    private LocalExercicioController controller;

    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(controller).build();
    }

    @Test
    void cadastrarDeveSalvarComStatusAtivoECoordenadas() throws Exception {
        String corpo = """
                {"nome":"Praça da Saúde","logradouro":"Rua A, 10","cep":"01001-000",
                 "latitude":-23.55052,"longitude":-46.633308}
                """;

        mockMvc.perform(post("/vitalsenior/locais").contentType(MediaType.APPLICATION_JSON).content(corpo))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.nome").value("Praça da Saúde"))
                .andExpect(jsonPath("$.status").value("ATIVO"));

        ArgumentCaptor<LocalExercicio> salvo = ArgumentCaptor.forClass(LocalExercicio.class);
        verify(repo).save(salvo.capture());
        assertThat(salvo.getValue().getLatitude()).isEqualByComparingTo(new BigDecimal("-23.55052"));
        assertThat(salvo.getValue().getLongitude()).isEqualByComparingTo(new BigDecimal("-46.633308"));
    }

    @Test
    void cadastrarSemCoordenadasDeveRetornar400() throws Exception {
        mockMvc.perform(post("/vitalsenior/locais").contentType(MediaType.APPLICATION_JSON)
                        .content("{\"nome\":\"Praça da Saúde\"}"))
                .andExpect(status().isBadRequest());

        verifyNoInteractions(repo);
    }

    @Test
    void listarTodosDeveRetornarOsLocais() throws Exception {
        when(repo.findAll()).thenReturn(List.of(Fixtures.local(1, "Praça A"), Fixtures.local(2, "Praça B")));

        mockMvc.perform(get("/vitalsenior/locais"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].nome").value("Praça A"));
    }

    @Test
    void buscarPorIdExistenteDeveRetornar200() throws Exception {
        when(repo.findById(1)).thenReturn(Optional.of(Fixtures.local(1, "Praça A")));

        mockMvc.perform(get("/vitalsenior/locais/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.idLocal").value(1));
    }

    @Test
    void buscarPorIdInexistenteDeveRetornar404() throws Exception {
        when(repo.findById(99)).thenReturn(Optional.empty());

        mockMvc.perform(get("/vitalsenior/locais/99"))
                .andExpect(status().isNotFound());
    }
}

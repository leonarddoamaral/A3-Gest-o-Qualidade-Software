package com.vitalsenior.demo.integration;

import com.vitalsenior.demo.local.LocalExercicio;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;

import java.math.BigDecimal;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class LocalExercicioIT extends IntegrationTestBase {

    @Test
    void cadastrarDevePersistirLocalAtivoComCoordenadas() throws Exception {
        String corpo = """
                {"nome":"Praça da Saúde","logradouro":"Rua A, 10","cep":"01001-000",
                 "latitude":-23.55052,"longitude":-46.633308}
                """;

        mockMvc.perform(post("/vitalsenior/locais").contentType(MediaType.APPLICATION_JSON).content(corpo))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.idLocal").isNumber())
                .andExpect(jsonPath("$.status").value("ATIVO"));

        LocalExercicio salvo = localRepo.findAll().get(0);
        assertThat(salvo.getNome()).isEqualTo("Praça da Saúde");
        assertThat(salvo.getLatitude()).isEqualByComparingTo(new BigDecimal("-23.55052"));
        assertThat(salvo.getLongitude()).isEqualByComparingTo(new BigDecimal("-46.633308"));
    }

    @Test
    void cadastrarSemCoordenadasDeveRetornar400() throws Exception {
        mockMvc.perform(post("/vitalsenior/locais").contentType(MediaType.APPLICATION_JSON)
                        .content("{\"nome\":\"Sem coordenadas\"}"))
                .andExpect(status().isBadRequest());

        assertThat(localRepo.count()).isZero();
    }

    @Test
    void listarEBuscarPorIdDevemRefletirOQueEstaNoBanco() throws Exception {
        LocalExercicio a = salvarLocal("Praça A");
        salvarLocal("Praça B");

        mockMvc.perform(get("/vitalsenior/locais"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2));

        mockMvc.perform(get("/vitalsenior/locais/" + a.getIdLocal()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nome").value("Praça A"));

        mockMvc.perform(get("/vitalsenior/locais/" + (a.getIdLocal() + 1000)))
                .andExpect(status().isNotFound());
    }
}

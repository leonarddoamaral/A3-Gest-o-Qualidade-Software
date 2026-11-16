package com.vitalsenior.demo.integration;

import com.vitalsenior.demo.exercicio.DadosCadastroExercicio;
import com.vitalsenior.demo.exercicio.Exercicio;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class ExercicioIT extends IntegrationTestBase {

    @Test
    void cadastrarDevePersistirExercicioAtivo() throws Exception {
        String corpo = """
                {"titulo":"Agachamento","descricao":"Fortalece pernas","nivelDificuldade":"FACIL",
                 "instrucoes":"Coluna reta","precaucoes":"Use apoio","url":"V2_5G2Y3kXw"}
                """;

        mockMvc.perform(post("/vitalsenior/exercicios").contentType(MediaType.APPLICATION_JSON).content(corpo))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.idExercicio").isNumber())
                .andExpect(jsonPath("$.status").value("ATIVO"));

        Exercicio salvo = exercicioRepo.findAll().get(0);
        assertThat(salvo.getTitulo()).isEqualTo("Agachamento");
        assertThat(salvo.getUrl()).isEqualTo("V2_5G2Y3kXw");
    }

    @Test
    void cadastrarSemCamposObrigatoriosDeveRetornar400() throws Exception {
        mockMvc.perform(post("/vitalsenior/exercicios").contentType(MediaType.APPLICATION_JSON)
                        .content("{\"titulo\":\"Sem url\"}"))
                .andExpect(status().isBadRequest());

        assertThat(exercicioRepo.count()).isZero();
    }

    @Test
    void listarEBuscarPorIdDevemRefletirOQueEstaNoBanco() throws Exception {
        Exercicio salvo = exercicioRepo.save(new Exercicio(new DadosCadastroExercicio(
                "Alongamento", null, "FACIL", null, null, null, "abc123")));

        mockMvc.perform(get("/vitalsenior/exercicios"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].titulo").value("Alongamento"));

        mockMvc.perform(get("/vitalsenior/exercicios/" + salvo.getIdExercicio()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.url").value("abc123"));

        mockMvc.perform(get("/vitalsenior/exercicios/" + (salvo.getIdExercicio() + 1000)))
                .andExpect(status().isNotFound());
    }
}

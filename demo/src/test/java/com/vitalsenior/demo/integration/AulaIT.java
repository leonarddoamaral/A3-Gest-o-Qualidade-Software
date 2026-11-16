package com.vitalsenior.demo.integration;

import com.vitalsenior.demo.aula.Aula;
import com.vitalsenior.demo.local.LocalExercicio;
import com.vitalsenior.demo.usuario.Usuario;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class AulaIT extends IntegrationTestBase {

    private String corpoAula(Integer idProfessor, Integer idLocal) {
        return """
                {"idProfessor":%d,"idLocal":%d,"titulo":"Alongamento","descricao":"Aula leve",
                 "dataHoraInicio":"2026-12-01T10:00:00","dataHoraFinal":"2026-12-01T11:00:00"}
                """.formatted(idProfessor, idLocal);
    }

    @Test
    void cadastrarDevePersistirAulaAgendadaComProfessorELocal() throws Exception {
        Usuario professor = salvarUsuario("Prof. Ana", "ana@email.com");
        LocalExercicio local = salvarLocal("Praça da Saúde");

        mockMvc.perform(post("/vitalsenior/aulas").contentType(MediaType.APPLICATION_JSON)
                        .content(corpoAula(professor.getIdUsuario(), local.getIdLocal())))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.idAula").isNumber())
                .andExpect(jsonPath("$.status").value("AGENDADA"))
                .andExpect(jsonPath("$.nomeProfessor").value("Prof. Ana"))
                .andExpect(jsonPath("$.local.nome").value("Praça da Saúde"));

        Aula salva = aulaRepo.findAll().get(0);
        assertThat(salva.getTitulo()).isEqualTo("Alongamento");
        assertThat(salva.getProfessor().getIdUsuario()).isEqualTo(professor.getIdUsuario());
        assertThat(salva.getDataHoraInicio().getHour()).isEqualTo(10);
    }

    @Test
    void cadastrarComProfessorInexistenteDeveFalharENaoPersistir() {
        LocalExercicio local = salvarLocal("Praça da Saúde");

        assertThatThrownBy(() -> mockMvc.perform(post("/vitalsenior/aulas")
                .contentType(MediaType.APPLICATION_JSON).content(corpoAula(9999, local.getIdLocal()))))
                .hasRootCauseMessage("Professor não encontrado");

        assertThat(aulaRepo.count()).isZero();
    }

    @Test
    void listarEBuscarPorIdDevemRetornarAulasDoBanco() throws Exception {
        Aula aula = salvarAula(salvarUsuario("Prof. Ana", "ana@email.com"), salvarLocal("Praça"));

        mockMvc.perform(get("/vitalsenior/aulas"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].titulo").value("Hidroginástica"));

        mockMvc.perform(get("/vitalsenior/aulas/" + aula.getIdAula()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nomeProfessor").value("Prof. Ana"));

        mockMvc.perform(get("/vitalsenior/aulas/" + (aula.getIdAula() + 1000)))
                .andExpect(status().isNotFound());
    }

    @Test
    void cancelarDevePersistirStatusEMotivo() throws Exception {
        Aula aula = salvarAula(salvarUsuario("Prof. Ana", "ana@email.com"), salvarLocal("Praça"));

        mockMvc.perform(patch("/vitalsenior/aulas/" + aula.getIdAula() + "/cancelar")
                        .contentType(MediaType.TEXT_PLAIN).content("Chuva forte"))
                .andExpect(status().isNoContent());

        Aula cancelada = aulaRepo.findById(aula.getIdAula()).orElseThrow();
        assertThat(cancelada.getStatus()).isEqualTo("CANCELADA");
        assertThat(cancelada.getMotivoCancelamento()).isEqualTo("Chuva forte");
    }

    @Test
    void cancelarAulaInexistenteDeveRetornar404() throws Exception {
        mockMvc.perform(patch("/vitalsenior/aulas/9999/cancelar")
                        .contentType(MediaType.TEXT_PLAIN).content("qualquer"))
                .andExpect(status().isNotFound());
    }
}

package com.vitalsenior.demo.integration;

import com.vitalsenior.demo.ficha.FichaSaude;
import com.vitalsenior.demo.usuario.Usuario;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class FichaSaudeIT extends IntegrationTestBase {

    private String corpo(Integer idUsuario) {
        return """
                {"doresPeitoTontura":false,"historicoQuedas":true,"problemasArticulacoes":true,
                 "nomeContatoEmergencia":"José","telefoneEmergencia":"11888888888","idUsuario":%d}
                """.formatted(idUsuario);
    }

    @Test
    void cadastrarDevePersistirFichaVinculadaAoUsuario() throws Exception {
        Usuario usuario = salvarUsuario("Maria", "maria@email.com");

        mockMvc.perform(post("/vitalsenior/fichasaude").contentType(MediaType.APPLICATION_JSON)
                        .content(corpo(usuario.getIdUsuario())))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.idUsuario").value(usuario.getIdUsuario()))
                .andExpect(jsonPath("$.historicoQuedas").value(true));

        FichaSaude ficha = fichaRepo.findByUsuario_IdUsuario(usuario.getIdUsuario());
        assertThat(ficha).isNotNull();
        assertThat(ficha.getNomeContatoEmergencia()).isEqualTo("José");
        assertThat(ficha.getDoresPeitoTontura()).isFalse();
    }

    @Test
    void cadastrarSegundaFichaParaOMesmoUsuarioDeveRetornar409() throws Exception {
        Usuario usuario = salvarUsuario("Maria", "maria@email.com");

        mockMvc.perform(post("/vitalsenior/fichasaude").contentType(MediaType.APPLICATION_JSON)
                        .content(corpo(usuario.getIdUsuario())))
                .andExpect(status().isCreated());
        mockMvc.perform(post("/vitalsenior/fichasaude").contentType(MediaType.APPLICATION_JSON)
                        .content(corpo(usuario.getIdUsuario())))
                .andExpect(status().isConflict());

        assertThat(fichaRepo.count()).isEqualTo(1);
    }

    @Test
    void cadastrarParaUsuarioInexistenteDeveRetornar404() throws Exception {
        mockMvc.perform(post("/vitalsenior/fichasaude").contentType(MediaType.APPLICATION_JSON)
                        .content(corpo(9999)))
                .andExpect(status().isNotFound());

        assertThat(fichaRepo.count()).isZero();
    }
}

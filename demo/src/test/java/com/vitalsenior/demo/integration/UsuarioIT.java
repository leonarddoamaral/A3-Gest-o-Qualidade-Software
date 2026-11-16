package com.vitalsenior.demo.integration;

import com.vitalsenior.demo.usuario.Usuario;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class UsuarioIT extends IntegrationTestBase {

    private static final String CADASTRO = """
            {"nome":"Maria Silva","email":"maria@email.com","senhaHash":"senha123",
             "telefone":"11999999999","dataNascimento":"1950-05-10","tipoPerfil":"ALUNO"}
            """;

    @Test
    void cadastroDevePersistirUsuarioComSenhaCriptografadaComBcrypt() throws Exception {
        mockMvc.perform(post("/vitalsenior/usuario").contentType(MediaType.APPLICATION_JSON).content(CADASTRO))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.email").value("maria@email.com"));

        Usuario salvo = usuarioRepo.findByEmail("maria@email.com");
        assertThat(salvo).isNotNull();
        assertThat(salvo.getIdUsuario()).isNotNull();
        assertThat(salvo.getNome()).isEqualTo("Maria Silva");
        assertThat(salvo.getSenhaHash()).startsWith("$2").isNotEqualTo("senha123");
    }

    @Test
    void cadastroInvalidoDeveRetornar400ENaoPersistir() throws Exception {
        mockMvc.perform(post("/vitalsenior/usuario").contentType(MediaType.APPLICATION_JSON).content("{}"))
                .andExpect(status().isBadRequest());

        assertThat(usuarioRepo.count()).isZero();
    }

    @Test
    void loginComCredenciaisCorretasDeveRetornarOUsuario() throws Exception {
        mockMvc.perform(post("/vitalsenior/usuario").contentType(MediaType.APPLICATION_JSON).content(CADASTRO))
                .andExpect(status().isCreated());

        mockMvc.perform(post("/vitalsenior/usuario/login").contentType(MediaType.APPLICATION_JSON)
                        .content("{\"email\":\"maria@email.com\",\"senha\":\"senha123\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").isNumber())
                .andExpect(jsonPath("$.nome").value("Maria Silva"))
                .andExpect(jsonPath("$.senhaHash").doesNotExist());
    }

    @Test
    void loginComSenhaIncorretaDeveRetornar401() throws Exception {
        mockMvc.perform(post("/vitalsenior/usuario").contentType(MediaType.APPLICATION_JSON).content(CADASTRO))
                .andExpect(status().isCreated());

        mockMvc.perform(post("/vitalsenior/usuario/login").contentType(MediaType.APPLICATION_JSON)
                        .content("{\"email\":\"maria@email.com\",\"senha\":\"errada\"}"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void loginComEmailInexistenteDeveRetornar404() throws Exception {
        mockMvc.perform(post("/vitalsenior/usuario/login").contentType(MediaType.APPLICATION_JSON)
                        .content("{\"email\":\"ninguem@email.com\",\"senha\":\"qualquer\"}"))
                .andExpect(status().isNotFound());
    }

    @Test
    void buscarPorIdDeveRetornarUsuarioExistenteE404ParaInexistente() throws Exception {
        Usuario usuario = salvarUsuario("João", "joao@email.com");

        mockMvc.perform(get("/vitalsenior/usuario/" + usuario.getIdUsuario()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nome").value("João"))
                .andExpect(jsonPath("$.tipoPerfil").value("ALUNO"));

        mockMvc.perform(get("/vitalsenior/usuario/" + (usuario.getIdUsuario() + 1000)))
                .andExpect(status().isNotFound());
    }
}

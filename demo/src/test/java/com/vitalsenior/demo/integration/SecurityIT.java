package com.vitalsenior.demo.integration;

import org.junit.jupiter.api.Test;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.options;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/** Verifica regras do SecurityConfig: rotas públicas, rotas protegidas e CORS. */
class SecurityIT extends IntegrationTestBase {

    @Test
    void rotasPublicasDevemSerAcessiveisSemAutenticacao() throws Exception {
        for (String rota : new String[]{"/vitalsenior/exercicios", "/vitalsenior/locais", "/vitalsenior/aulas"}) {
            mockMvc.perform(get(rota))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.length()").value(0));
        }
    }

    @Test
    void rotaForaDaListaPublicaDeveExigirAutenticacao() throws Exception {
        mockMvc.perform(get("/vitalsenior/rota-protegida"))
                .andExpect(status().is4xxClientError());
    }

    @Test
    void preflightDeOrigemPermitidaDeveSerAceito() throws Exception {
        mockMvc.perform(options("/vitalsenior/usuario")
                        .header("Origin", "http://localhost:5173")
                        .header("Access-Control-Request-Method", "POST"))
                .andExpect(status().isOk())
                .andExpect(header().string("Access-Control-Allow-Origin", "http://localhost:5173"));
    }

    @Test
    void preflightDeOrigemNaoPermitidaDeveSerRejeitado() throws Exception {
        mockMvc.perform(options("/vitalsenior/usuario")
                        .header("Origin", "http://site-desconhecido.example")
                        .header("Access-Control-Request-Method", "POST"))
                .andExpect(status().isForbidden());
    }
}

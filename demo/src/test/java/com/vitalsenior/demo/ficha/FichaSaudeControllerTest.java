package com.vitalsenior.demo.ficha;

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

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
class FichaSaudeControllerTest {

    private static final String FICHA = """
            {"doresPeitoTontura":false,"historicoQuedas":true,"problemasArticulacoes":true,
             "nomeContatoEmergencia":"José","telefoneEmergencia":"11888888888","idUsuario":1}
            """;

    @Mock
    private FichaSaudeRepo fichaRepo;
    @Mock
    private UsuarioRepo usuarioRepo;
    @InjectMocks
    private FichaSaudeController controller;

    private MockMvc mockMvc;
    private Usuario usuario;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(controller).build();
        usuario = Fixtures.usuario(1, "Maria", "maria@email.com");
    }

    @Test
    void cadastrarDeveSalvarFichaVinculadaAoUsuario() throws Exception {
        when(usuarioRepo.findById(1)).thenReturn(Optional.of(usuario));
        when(fichaRepo.findByUsuario_IdUsuario(1)).thenReturn(null);

        mockMvc.perform(post("/vitalsenior/fichasaude").contentType(MediaType.APPLICATION_JSON).content(FICHA))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.idUsuario").value(1))
                .andExpect(jsonPath("$.historicoQuedas").value(true))
                .andExpect(jsonPath("$.nomeContatoEmergencia").value("José"));

        ArgumentCaptor<FichaSaude> salva = ArgumentCaptor.forClass(FichaSaude.class);
        verify(fichaRepo).save(salva.capture());
        assertThat(salva.getValue().getUsuario()).isSameAs(usuario);
    }

    @Test
    void cadastrarComUsuarioInexistenteDeveRetornar404() throws Exception {
        when(usuarioRepo.findById(1)).thenReturn(Optional.empty());

        mockMvc.perform(post("/vitalsenior/fichasaude").contentType(MediaType.APPLICATION_JSON).content(FICHA))
                .andExpect(status().isNotFound());

        verify(fichaRepo, never()).save(any());
    }

    @Test
    void cadastrarSegundaFichaDoMesmoUsuarioDeveRetornar409() throws Exception {
        when(usuarioRepo.findById(1)).thenReturn(Optional.of(usuario));
        when(fichaRepo.findByUsuario_IdUsuario(1)).thenReturn(new FichaSaude());

        mockMvc.perform(post("/vitalsenior/fichasaude").contentType(MediaType.APPLICATION_JSON).content(FICHA))
                .andExpect(status().isConflict());

        verify(fichaRepo, never()).save(any());
    }

    @Test
    void cadastrarSemRespostasObrigatoriasDeveRetornar400() throws Exception {
        mockMvc.perform(post("/vitalsenior/fichasaude").contentType(MediaType.APPLICATION_JSON)
                        .content("{\"idUsuario\":1}"))
                .andExpect(status().isBadRequest());

        verifyNoInteractions(fichaRepo, usuarioRepo);
    }
}

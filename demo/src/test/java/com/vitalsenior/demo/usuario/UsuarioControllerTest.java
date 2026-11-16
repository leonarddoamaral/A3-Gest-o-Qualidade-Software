package com.vitalsenior.demo.usuario;

import com.vitalsenior.demo.support.Fixtures;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
class UsuarioControllerTest {

    private static final String CADASTRO_VALIDO = """
            {"nome":"Maria Silva","email":"maria@email.com","senhaHash":"senha123",
             "telefone":"11999999999","dataNascimento":"1950-05-10","tipoPerfil":"ALUNO"}
            """;

    @Mock
    private UsuarioRepo repo;
    @Mock
    private PasswordEncoder passwordEncoder;
    @InjectMocks
    private UsuarioController controller;

    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(controller).build();
    }

    @Test
    void cadastroDeveCriptografarASenhaESalvarOUsuario() throws Exception {
        when(passwordEncoder.encode("senha123")).thenReturn("$2a$hash-gerado");

        mockMvc.perform(post("/vitalsenior/usuario").contentType(MediaType.APPLICATION_JSON).content(CADASTRO_VALIDO))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.nome").value("Maria Silva"))
                .andExpect(jsonPath("$.email").value("maria@email.com"));

        ArgumentCaptor<Usuario> salvo = ArgumentCaptor.forClass(Usuario.class);
        verify(repo).save(salvo.capture());
        assertThat(salvo.getValue().getSenhaHash()).isEqualTo("$2a$hash-gerado");
        assertThat(salvo.getValue().getEmail()).isEqualTo("maria@email.com");
    }

    @Test
    void cadastroInvalidoDeveRetornar400SemTocarNoBanco() throws Exception {
        mockMvc.perform(post("/vitalsenior/usuario").contentType(MediaType.APPLICATION_JSON).content("{}"))
                .andExpect(status().isBadRequest());

        verifyNoInteractions(repo, passwordEncoder);
    }

    @Test
    void loginComEmailInexistenteDeveRetornar404() throws Exception {
        when(repo.findByEmail("naoexiste@email.com")).thenReturn(null);

        mockMvc.perform(post("/vitalsenior/usuario/login").contentType(MediaType.APPLICATION_JSON)
                        .content("{\"email\":\"naoexiste@email.com\",\"senha\":\"qualquer\"}"))
                .andExpect(status().isNotFound());

        verifyNoInteractions(passwordEncoder);
    }

    @Test
    void loginComSenhaIncorretaDeveRetornar401() throws Exception {
        Usuario usuario = Fixtures.usuario(1, "Maria Silva", "maria@email.com");
        when(repo.findByEmail("maria@email.com")).thenReturn(usuario);
        when(passwordEncoder.matches("errada", "hash-fake")).thenReturn(false);

        mockMvc.perform(post("/vitalsenior/usuario/login").contentType(MediaType.APPLICATION_JSON)
                        .content("{\"email\":\"maria@email.com\",\"senha\":\"errada\"}"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void loginComCredenciaisCorretasDeveRetornarDadosSemSenha() throws Exception {
        Usuario usuario = Fixtures.usuario(1, "Maria Silva", "maria@email.com");
        when(repo.findByEmail("maria@email.com")).thenReturn(usuario);
        when(passwordEncoder.matches("senha123", "hash-fake")).thenReturn(true);

        mockMvc.perform(post("/vitalsenior/usuario/login").contentType(MediaType.APPLICATION_JSON)
                        .content("{\"email\":\"maria@email.com\",\"senha\":\"senha123\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.nome").value("Maria Silva"))
                .andExpect(jsonPath("$.tipoPerfil").value("ALUNO"))
                .andExpect(jsonPath("$.senhaHash").doesNotExist());
    }

    @Test
    void buscarPorIdExistenteDeveRetornar200() throws Exception {
        when(repo.findById(1)).thenReturn(Optional.of(Fixtures.usuario(1, "Maria Silva", "maria@email.com")));

        mockMvc.perform(get("/vitalsenior/usuario/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value("maria@email.com"));
    }

    @Test
    void buscarPorIdInexistenteDeveRetornar404() throws Exception {
        when(repo.findById(99)).thenReturn(Optional.empty());

        mockMvc.perform(get("/vitalsenior/usuario/99"))
                .andExpect(status().isNotFound());
    }
}

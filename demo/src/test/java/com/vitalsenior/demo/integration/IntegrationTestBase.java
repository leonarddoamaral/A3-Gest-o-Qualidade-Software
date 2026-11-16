package com.vitalsenior.demo.integration;

import com.vitalsenior.demo.agendamento.AgendamentoRepo;
import com.vitalsenior.demo.aula.Aula;
import com.vitalsenior.demo.aula.AulaRepo;
import com.vitalsenior.demo.avaliacao.AvaliacaoAulaRepo;
import com.vitalsenior.demo.exercicio.ExercicioRepo;
import com.vitalsenior.demo.ficha.FichaSaudeRepo;
import com.vitalsenior.demo.local.LocalExercicio;
import com.vitalsenior.demo.local.LocalExercicioRepo;
import com.vitalsenior.demo.support.Fixtures;
import com.vitalsenior.demo.usuario.Usuario;
import com.vitalsenior.demo.usuario.UsuarioRepo;
import org.junit.jupiter.api.BeforeEach;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;

/**
 * Base dos testes de integração: sobe a aplicação inteira contra o Postgres do perfil "test"
 * (ver application-test.properties) e limpa as tabelas antes de cada teste.
 * Todas as classes *IT herdam desta, então compartilham um único contexto Spring.
 */
@SpringBootTest
@ActiveProfiles("test")
public abstract class IntegrationTestBase {

    @Autowired
    protected WebApplicationContext context;
    @Autowired
    protected UsuarioRepo usuarioRepo;
    @Autowired
    protected LocalExercicioRepo localRepo;
    @Autowired
    protected AulaRepo aulaRepo;
    @Autowired
    protected AgendamentoRepo agendamentoRepo;
    @Autowired
    protected AvaliacaoAulaRepo avaliacaoRepo;
    @Autowired
    protected ExercicioRepo exercicioRepo;
    @Autowired
    protected FichaSaudeRepo fichaRepo;

    protected MockMvc mockMvc;

    @BeforeEach
    protected void prepararAmbiente() {
        mockMvc = MockMvcBuilders.webAppContextSetup(context).apply(springSecurity()).build();

        // Ordem respeita as chaves estrangeiras
        avaliacaoRepo.deleteAll();
        agendamentoRepo.deleteAll();
        fichaRepo.deleteAll();
        aulaRepo.deleteAll();
        exercicioRepo.deleteAll();
        localRepo.deleteAll();
        usuarioRepo.deleteAll();
    }

    protected Usuario salvarUsuario(String nome, String email) {
        return usuarioRepo.save(Fixtures.usuario(null, nome, email));
    }

    protected LocalExercicio salvarLocal(String nome) {
        return localRepo.save(Fixtures.local(null, nome));
    }

    protected Aula salvarAula(Usuario professor, LocalExercicio local) {
        return aulaRepo.save(Fixtures.aula(null, professor, local));
    }
}

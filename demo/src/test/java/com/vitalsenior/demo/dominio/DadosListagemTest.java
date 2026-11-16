package com.vitalsenior.demo.dominio;

import com.vitalsenior.demo.agendamento.Agendamento;
import com.vitalsenior.demo.agendamento.DadosListagemAgendamento;
import com.vitalsenior.demo.aula.Aula;
import com.vitalsenior.demo.aula.DadosListagemAula;
import com.vitalsenior.demo.support.Fixtures;
import com.vitalsenior.demo.usuario.Usuario;
import com.vitalsenior.demo.usuario.dadosListagemUsuario;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class DadosListagemTest {

    @Test
    void listagemDeAulaDeveTolerarProfessorELocalNulos() {
        DadosListagemAula dados = new DadosListagemAula(new Aula());

        assertThat(dados.nomeProfessor()).isNull();
        assertThat(dados.local()).isNull();
    }

    @Test
    void listagemDeAulaDeveExporNomeDoProfessorEDadosDoLocal() {
        Usuario professor = Fixtures.usuario(1, "Prof. Ana", "ana@email.com");
        Aula aula = Fixtures.aula(10, professor, Fixtures.local(2, "Praça da Saúde"));

        DadosListagemAula dados = new DadosListagemAula(aula);

        assertThat(dados.idAula()).isEqualTo(10);
        assertThat(dados.titulo()).isEqualTo("Hidroginástica");
        assertThat(dados.status()).isEqualTo("AGENDADA");
        assertThat(dados.nomeProfessor()).isEqualTo("Prof. Ana");
        assertThat(dados.local().nome()).isEqualTo("Praça da Saúde");
        assertThat(dados.local().idLocal()).isEqualTo(2);
    }

    @Test
    void listagemDeAgendamentoDeveIncluirAulaEStatus() {
        Usuario aluno = Fixtures.usuario(1, "Maria", "maria@email.com");
        Aula aula = Fixtures.aula(10, Fixtures.usuario(2, "Prof. Ana", "ana@email.com"), Fixtures.local(3, "Praça"));
        Agendamento agendamento = Fixtures.agendamento(5, aluno, aula);

        DadosListagemAgendamento dados = new DadosListagemAgendamento(agendamento);

        assertThat(dados.idAgendamento()).isEqualTo(5);
        assertThat(dados.statusAgendamento()).isEqualTo("CONFIRMADO");
        assertThat(dados.statusPresenca()).isEqualTo("PENDENTE");
        assertThat(dados.aula().idAula()).isEqualTo(10);
    }

    @Test
    void listagemDeUsuarioNaoDeveTerCampoDeSenha() {
        Usuario usuario = Fixtures.usuario(3, "Maria", "maria@email.com");

        dadosListagemUsuario dados = new dadosListagemUsuario(usuario);

        assertThat(dados.id()).isEqualTo(3);
        assertThat(dados.email()).isEqualTo("maria@email.com");
        assertThat(dadosListagemUsuario.class.getRecordComponents())
                .extracting(c -> c.getName())
                .noneMatch(nome -> nome.toLowerCase().contains("senha"));
    }
}

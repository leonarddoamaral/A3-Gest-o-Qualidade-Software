package com.vitalsenior.demo.usuario;

import org.springframework.cglib.core.Local;

import java.time.LocalDate;

public record dadosListagemUsuario(
        int id, String nome, String email, String telefone, LocalDate dataNascimento, String tipoPerfil)
{public dadosListagemUsuario(Usuario usuario){
    this(usuario.getIdUsuario(), usuario.getNome(), usuario.getEmail(), usuario.getTelefone(), usuario.getDataNascimento(), usuario.getTipoPerfil());
}
}

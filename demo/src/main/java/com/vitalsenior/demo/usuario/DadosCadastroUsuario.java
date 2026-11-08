package com.vitalsenior.demo.usuario;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;



public record DadosCadastroUsuario(
        @NotBlank String nome,
        @NotBlank String email,
        @NotBlank String senhaHash,
        @NotBlank String telefone,
        @NotNull LocalDate dataNascimento,
        @NotBlank String tipoPerfil
) {
    public DadosCadastroUsuario(Usuario usuario) {
        this(usuario.getNome(), usuario.getEmail(), usuario.getSenhaHash(),
                usuario.getTelefone(), usuario.getDataNascimento(), usuario.getTipoPerfil());
    }
}

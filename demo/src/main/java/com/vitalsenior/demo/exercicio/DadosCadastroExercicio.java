package com.vitalsenior.demo.exercicio;

import jakarta.validation.constraints.NotBlank;

public record DadosCadastroExercicio(
        @NotBlank String titulo,
        String descricao,
        @NotBlank String nivelDificuldade,
        String instrucoes,
        String precaucoes,
        String status,
        @NotBlank String url
) {}
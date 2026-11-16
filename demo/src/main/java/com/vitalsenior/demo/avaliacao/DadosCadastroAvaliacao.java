package com.vitalsenior.demo.avaliacao;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record DadosCadastroAvaliacao(
        @NotNull Integer idAgendamento,
        @NotNull @Min(1) @Max(5) Integer avaliacaoExperiencia,
        @NotNull @Min(1) @Max(5) Integer avaliacaoDificuldade,
        String relatoProblema
) {}
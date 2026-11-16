package com.vitalsenior.demo.agendamento;

import jakarta.validation.constraints.NotNull;

public record DadosCadastroAgendamento(
        @NotNull Integer idAluno,
        @NotNull Integer idAula
) {}
package com.vitalsenior.demo.aula;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

public record DadosCadastroAula(
        @NotNull Integer idProfessor,
        @NotNull Integer idLocal,
        @NotBlank String titulo,
        String descricao,
        @NotNull LocalDateTime dataHoraInicio,
        @NotNull LocalDateTime dataHoraFinal
) {}
package com.vitalsenior.demo.local;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public record DadosCadastroLocal(
        @NotBlank String nome,
        String descricao,
        String logradouro,
        String status,
        String cep,
        @NotNull BigDecimal latitude,
        @NotNull BigDecimal longitude
) {}
package com.vitalsenior.demo.local;

import java.math.BigDecimal;

public record DadosListagemLocal(
        Integer idLocal,
        String nome,
        String descricao,
        String logradouro,
        String status,
        String cep,
        BigDecimal latitude,
        BigDecimal longitude
) {
    public DadosListagemLocal(LocalExercicio local) {
        this(local.getIdLocal(), local.getNome(), local.getDescricao(), local.getLogradouro(),
                local.getStatus(), local.getCep(), local.getLatitude(), local.getLongitude());
    }
}
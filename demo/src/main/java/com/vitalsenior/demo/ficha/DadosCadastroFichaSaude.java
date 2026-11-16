package com.vitalsenior.demo.ficha;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record DadosCadastroFichaSaude(
        @NotNull Boolean doresPeitoTontura,
        @NotNull Boolean historicoQuedas,
        @NotNull Boolean problemasArticulacoes,
        @NotBlank String nomeContatoEmergencia,
        @NotBlank String telefoneEmergencia,
        @NotNull Integer idUsuario
) {
    public DadosCadastroFichaSaude(FichaSaude ficha) {
        this(
                ficha.getDoresPeitoTontura(),
                ficha.getHistoricoQuedas(),
                ficha.getProblemasArticulacoes(),
                ficha.getNomeContatoEmergencia(),
                ficha.getTelefoneEmergencia(),
                ficha.getUsuario().getIdUsuario()
        );
    }
}
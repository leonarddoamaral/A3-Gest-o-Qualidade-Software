package com.vitalsenior.demo.avaliacao;

import java.time.LocalDateTime;

public record DadosListagemAvaliacao(
        Integer idAvaliacao,
        Integer idAgendamento,
        Integer avaliacaoExperiencia,
        Integer avaliacaoDificuldade,
        String relatoProblema,
        LocalDateTime dataAvaliacao
) {
    public DadosListagemAvaliacao(AvaliacaoAula av) {
        this(av.getIdAvaliacao(), av.getAgendamento().getIdAgendamento(),
                av.getAvaliacaoExperiencia(), av.getAvaliacaoDificuldade(),
                av.getRelatoProblema(), av.getDataAvaliacao());
    }
}
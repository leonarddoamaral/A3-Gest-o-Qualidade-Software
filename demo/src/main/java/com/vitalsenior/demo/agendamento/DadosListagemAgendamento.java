package com.vitalsenior.demo.agendamento;

import com.vitalsenior.demo.aula.DadosListagemAula;
import java.time.LocalDateTime;

public record DadosListagemAgendamento(
        Integer idAgendamento,
        LocalDateTime dataSolicitacao,
        String statusAgendamento,
        String statusPresenca,
        DadosListagemAula aula
) {
    public DadosListagemAgendamento(Agendamento ag) {
        this(
                ag.getIdAgendamento(),
                ag.getDataSolicitacao(),
                ag.getStatusAgendamento(),
                ag.getStatusPresenca(),
                new DadosListagemAula(ag.getAula())
        );
    }
}
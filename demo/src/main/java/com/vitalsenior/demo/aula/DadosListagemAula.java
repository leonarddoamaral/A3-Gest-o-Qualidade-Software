package com.vitalsenior.demo.aula;

import com.vitalsenior.demo.local.DadosListagemLocal;
import java.time.LocalDateTime;

public record DadosListagemAula(
        Integer idAula,
        String titulo,
        String descricao,
        LocalDateTime dataHoraInicio,
        LocalDateTime dataHoraFinal,
        String status,
        String nomeProfessor,
        DadosListagemLocal local
) {
    public DadosListagemAula(Aula aula) {
        this(
                aula.getIdAula(),
                aula.getTitulo(),
                aula.getDescricao(),
                aula.getDataHoraInicio(),
                aula.getDataHoraFinal(),
                aula.getStatus(),
                aula.getProfessor() != null ? aula.getProfessor().getNome() : null,
                aula.getLocal() != null ? new DadosListagemLocal(aula.getLocal()) : null
        );
    }
}
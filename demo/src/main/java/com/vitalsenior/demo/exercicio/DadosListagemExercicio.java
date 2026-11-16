package com.vitalsenior.demo.exercicio;

public record DadosListagemExercicio(
        Integer idExercicio,
        String titulo,
        String descricao,
        String nivelDificuldade,
        String instrucoes,
        String precaucoes,
        String status,
        String url
) {
    public DadosListagemExercicio(Exercicio ex) {
        this(ex.getIdExercicio(), ex.getTitulo(), ex.getDescricao(), ex.getNivelDificuldade(),
                ex.getInstrucoes(), ex.getPrecaucoes(), ex.getStatus(), ex.getUrl());
    }
}
package com.vitalsenior.demo.exercicio;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Table(name = "exercicio")
@Entity
@Getter
@Setter
@NoArgsConstructor
public class Exercicio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idExercicio;

    private String titulo;
    private String descricao;
    private String nivelDificuldade;
    private String instrucoes;
    private String precaucoes;
    private String status;
    private String url;

    public Exercicio(DadosCadastroExercicio dados) {
        this.titulo = dados.titulo();
        this.descricao = dados.descricao();
        this.nivelDificuldade = dados.nivelDificuldade();
        this.instrucoes = dados.instrucoes();
        this.precaucoes = dados.precaucoes();
        this.status = dados.status() != null ? dados.status() : "ATIVO";
        this.url = dados.url();
    }
}
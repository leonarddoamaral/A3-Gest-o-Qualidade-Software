package com.vitalsenior.demo.local;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.math.BigDecimal;

@Table(name = "local_exercicio")
@Entity
@Getter
@Setter
@NoArgsConstructor
public class LocalExercicio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idLocal;

    private String nome;
    private String descricao;
    private String logradouro;
    private String status;
    private String cep;

    @Column(precision = 10, scale = 8)
    private BigDecimal latitude;

    @Column(precision = 11, scale = 8)
    private BigDecimal longitude;

    public LocalExercicio(DadosCadastroLocal dados) {
        this.nome = dados.nome();
        this.descricao = dados.descricao();
        this.logradouro = dados.logradouro();
        this.status = dados.status() != null ? dados.status() : "ATIVO";
        this.cep = dados.cep();
        this.latitude = dados.latitude();
        this.longitude = dados.longitude();
    }
}
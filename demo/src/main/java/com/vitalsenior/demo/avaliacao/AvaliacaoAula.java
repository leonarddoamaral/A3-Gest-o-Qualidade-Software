package com.vitalsenior.demo.avaliacao;

import com.vitalsenior.demo.agendamento.Agendamento;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDateTime;

@Table(name = "avaliacao_aula")
@Entity
@Getter
@Setter
@NoArgsConstructor
public class AvaliacaoAula {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idAvaliacao;

    @OneToOne
    @JoinColumn(name = "id_agendamento", referencedColumnName = "idAgendamento", unique = true)
    private Agendamento agendamento;

    private Integer avaliacaoExperiencia;
    private Integer avaliacaoDificuldade;
    private String relatoProblema;
    private LocalDateTime dataAvaliacao;

    public AvaliacaoAula(DadosCadastroAvaliacao dados, Agendamento agendamento) {
        this.agendamento = agendamento;
        this.avaliacaoExperiencia = dados.avaliacaoExperiencia();
        this.avaliacaoDificuldade = dados.avaliacaoDificuldade();
        this.relatoProblema = dados.relatoProblema();
        this.dataAvaliacao = LocalDateTime.now();
    }
}
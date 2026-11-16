package com.vitalsenior.demo.agendamento;

import com.vitalsenior.demo.aula.Aula;
import com.vitalsenior.demo.usuario.Usuario;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDateTime;

@Table(name = "agendamento")
@Entity
@Getter
@Setter
@NoArgsConstructor
public class Agendamento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idAgendamento;

    @ManyToOne
    @JoinColumn(name = "id_aluno", referencedColumnName = "idUsuario")
    private Usuario aluno;

    @ManyToOne
    @JoinColumn(name = "id_aula", referencedColumnName = "idAula")
    private Aula aula;

    private LocalDateTime dataSolicitacao;
    private String statusAgendamento;
    private String statusPresenca;

    public Agendamento(Usuario aluno, Aula aula) {
        this.aluno = aluno;
        this.aula = aula;
        this.dataSolicitacao = LocalDateTime.now();
        this.statusAgendamento = "CONFIRMADO";
        this.statusPresenca = "PENDENTE";
    }
}
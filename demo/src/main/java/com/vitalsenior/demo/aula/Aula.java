package com.vitalsenior.demo.aula;

import com.vitalsenior.demo.local.LocalExercicio;
import com.vitalsenior.demo.usuario.Usuario;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDateTime;

@Table(name = "aula")
@Entity
@Getter
@Setter
@NoArgsConstructor
public class Aula {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idAula;

    @ManyToOne
    @JoinColumn(name = "id_professor", referencedColumnName = "idUsuario")
    private Usuario professor;

    @ManyToOne
    @JoinColumn(name = "id_local", referencedColumnName = "idLocal")
    private LocalExercicio local;

    private String titulo;
    private String descricao;
    private LocalDateTime dataHoraInicio;
    private LocalDateTime dataHoraFinal;
    private String status;
    private String motivoCancelamento;

    public Aula(DadosCadastroAula dados, Usuario professor, LocalExercicio local) {
        this.professor = professor;
        this.local = local;
        this.titulo = dados.titulo();
        this.descricao = dados.descricao();
        this.dataHoraInicio = dados.dataHoraInicio();
        this.dataHoraFinal = dados.dataHoraFinal();
        this.status = "AGENDADA";
    }
}
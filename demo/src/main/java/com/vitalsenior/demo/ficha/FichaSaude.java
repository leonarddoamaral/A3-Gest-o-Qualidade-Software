package com.vitalsenior.demo.ficha;

import com.vitalsenior.demo.usuario.Usuario;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Table(name= "ficha_saude")
@Getter
@Entity
@Setter
@NoArgsConstructor
public class FichaSaude {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idFicha;

    private Boolean doresPeitoTontura;
    private Boolean historicoQuedas;
    private Boolean problemasArticulacoes;
    private String nomeContatoEmergencia;
    private String telefoneEmergencia;

    // Relação 0..1 com Usuario conforme o diagrama UML
    @OneToOne
    @JoinColumn(name = "usuario_id", referencedColumnName = "idUsuario")
    private Usuario usuario;

    public FichaSaude(DadosCadastroFichaSaude dados, Usuario usuario){
        this.doresPeitoTontura = dados.doresPeitoTontura();
        this.historicoQuedas = dados.historicoQuedas();
        this.problemasArticulacoes = dados.problemasArticulacoes();
        this.nomeContatoEmergencia = dados.nomeContatoEmergencia();
        this.telefoneEmergencia = dados.telefoneEmergencia();
        this.usuario = usuario;
    }
}
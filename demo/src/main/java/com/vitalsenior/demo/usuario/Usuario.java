package com.vitalsenior.demo.usuario;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.util.Date;

@Table(name= "com/vitalsenior/demo/usuario")
@Getter
@Entity
@Setter
@NoArgsConstructor
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idUsuario;
    private String nome;
    private String email;
    private String senhaHash;
    private String telefone;
    private Date dataNascimento ;
    private String tipoPerfil ;

    public Usuario(DadosCadastroUsuario dados){
        this.nome = dados.nome();
        this.email = dados.email();
        this.telefone = dados.telefone();
        this.senhaHash = dados.senhaHash();
        this.dataNascimento = dados.dataNascimento();
        this.tipoPerfil = dados.tipoPerfil();
    }

}
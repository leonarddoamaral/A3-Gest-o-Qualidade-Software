package com.vitalsenior.demo.usuario;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;
@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/vitalsenior/usuario")
public class UsuarioController {
    @Autowired
    private UsuarioRepo repo;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @PostMapping
    public ResponseEntity<DadosCadastroUsuario> cadastroCliente(@RequestBody @Valid DadosCadastroUsuario dados){
        Usuario usuario = new Usuario(dados);
        String senhaCriptografada = passwordEncoder.encode(dados.senhaHash());
        usuario.setSenhaHash(senhaCriptografada);
        repo.save(usuario);
        return ResponseEntity.status(HttpStatus.CREATED).body(new DadosCadastroUsuario(usuario));
    }
    @CrossOrigin(origins = "*")
    @PostMapping("/login")
    public ResponseEntity<dadosListagemUsuario> efetuarLogin(@RequestBody DadosLogin dados) {
        Usuario usuario = repo.findByEmail(dados.email());

        if (usuario == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        boolean senhaValida = passwordEncoder.matches(dados.senha(), usuario.getSenhaHash());

        if (senhaValida) {
            // Retorna o objeto JSON com os dados do utilizador (incluindo o ID gerado)
            return ResponseEntity.ok(new dadosListagemUsuario(usuario));
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }
    @GetMapping("/{id}")
    public ResponseEntity<dadosListagemUsuario> listaUm(@PathVariable int id) {
        return repo.findById(id)
                .map(usuario -> ResponseEntity.ok(new dadosListagemUsuario(usuario)))
                .orElse(ResponseEntity.notFound().build());
    }

}

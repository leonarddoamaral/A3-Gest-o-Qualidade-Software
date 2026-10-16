package com.vitalsenior.demo.usuario;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
    @PostMapping("/login")
    public ResponseEntity<String> efetuarLogin(@RequestBody DadosLogin dados) {

        Usuario usuario = repo.findByEmail(dados.email());
        if (usuario == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Utilizador não encontrado.");
        }
        boolean senhaValida = passwordEncoder.matches(dados.senha(), usuario.getSenhaHash());// Mesmo a senha cripitografada ele consegue indentificar qual foi a senha usada e a compara
        if (senhaValida) {
            return ResponseEntity.ok("Login efetuado com sucesso!");
        } else {

            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Palavra-passe incorreta.");
        }
    }
}

package com.vitalsenior.demo.ficha;

import com.vitalsenior.demo.usuario.Usuario;
import com.vitalsenior.demo.usuario.UsuarioRepo;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/vitalsenior/fichasaude")
public class FichaSaudeController {

    @Autowired
    private FichaSaudeRepo fichaRepo;

    @Autowired
    private UsuarioRepo usuarioRepo;

    @PostMapping
    public ResponseEntity<DadosCadastroFichaSaude> cadastrarFicha(@RequestBody @Valid DadosCadastroFichaSaude dados) {

        Usuario usuario = usuarioRepo.findById(dados.idUsuario())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuário não encontrado."));

        // Opcional: Validar se o usuário já possui uma ficha cadastrada para respeitar a cardinalidade 0..1
        if(fichaRepo.findByUsuario_IdUsuario(usuario.getIdUsuario()) != null) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Usuário já possui uma ficha de saúde.");
        }

        FichaSaude ficha = new FichaSaude(dados, usuario);
        fichaRepo.save(ficha);

        return ResponseEntity.status(HttpStatus.CREATED).body(new DadosCadastroFichaSaude(ficha));
    }
}
package com.vitalsenior.demo.aula;

import com.vitalsenior.demo.local.LocalExercicioRepo;
import com.vitalsenior.demo.usuario.UsuarioRepo;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/vitalsenior/aulas")
public class AulaController {

    @Autowired
    private AulaRepo aulaRepo;

    @Autowired
    private UsuarioRepo usuarioRepo;

    @Autowired
    private LocalExercicioRepo localRepo;

    @PostMapping
    public ResponseEntity<DadosListagemAula> cadastrar(@RequestBody @Valid DadosCadastroAula dados) {
        var professor = usuarioRepo.findById(dados.idProfessor())
                .orElseThrow(() -> new RuntimeException("Professor não encontrado"));
        var local = localRepo.findById(dados.idLocal())
                .orElseThrow(() -> new RuntimeException("Local não encontrado"));

        Aula aula = new Aula(dados, professor, local);
        aulaRepo.save(aula);

        return ResponseEntity.status(HttpStatus.CREATED).body(new DadosListagemAula(aula));
    }

    @GetMapping
    public ResponseEntity<List<DadosListagemAula>> listarTodas() {
        var lista = aulaRepo.findAll().stream().map(DadosListagemAula::new).toList();
        return ResponseEntity.ok(lista);
    }

    @GetMapping("/{id}")
    public ResponseEntity<DadosListagemAula> buscarPorId(@PathVariable Integer id) {
        return aulaRepo.findById(id)
                .map(aula -> ResponseEntity.ok(new DadosListagemAula(aula)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PatchMapping("/{id}/cancelar")
    public ResponseEntity<Void> cancelarAula(@PathVariable Integer id, @RequestBody String motivo) {
        return aulaRepo.findById(id).map(aula -> {
            aula.setStatus("CANCELADA");
            aula.setMotivoCancelamento(motivo);
            aulaRepo.save(aula);
            return ResponseEntity.noContent().<Void>build();
        }).orElse(ResponseEntity.notFound().build());
    }
}
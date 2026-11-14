package com.vitalsenior.demo.local;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/vitalsenior/locais")
public class LocalExercicioController {

    @Autowired
    private LocalExercicioRepo repo;

    @PostMapping
    public ResponseEntity<DadosListagemLocal> cadastrar(@RequestBody @Valid DadosCadastroLocal dados) {
        LocalExercicio local = new LocalExercicio(dados);
        repo.save(local);
        return ResponseEntity.status(HttpStatus.CREATED).body(new DadosListagemLocal(local));
    }

    @GetMapping
    public ResponseEntity<List<DadosListagemLocal>> listarTodos() {
        var lista = repo.findAll().stream().map(DadosListagemLocal::new).toList();
        return ResponseEntity.ok(lista);
    }

    @GetMapping("/{id}")
    public ResponseEntity<DadosListagemLocal> buscarPorId(@PathVariable Integer id) {
        return repo.findById(id)
                .map(local -> ResponseEntity.ok(new DadosListagemLocal(local)))
                .orElse(ResponseEntity.notFound().build());
    }
}
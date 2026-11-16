package com.vitalsenior.demo.exercicio;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/vitalsenior/exercicios")
public class ExercicioController {

    @Autowired
    private ExercicioRepo repo;

    @PostMapping
    public ResponseEntity<DadosListagemExercicio> cadastrar(@RequestBody @Valid DadosCadastroExercicio dados) {
        Exercicio exercicio = new Exercicio(dados);
        repo.save(exercicio);
        return ResponseEntity.status(HttpStatus.CREATED).body(new DadosListagemExercicio(exercicio));
    }

    @GetMapping
    public ResponseEntity<List<DadosListagemExercicio>> listarTodos() {
        var lista = repo.findAll().stream().map(DadosListagemExercicio::new).toList();
        return ResponseEntity.ok(lista);
    }

    @GetMapping("/{id}")
    public ResponseEntity<DadosListagemExercicio> buscarPorId(@PathVariable Integer id) {
        return repo.findById(id)
                .map(ex -> ResponseEntity.ok(new DadosListagemExercicio(ex)))
                .orElse(ResponseEntity.notFound().build());
    }
}
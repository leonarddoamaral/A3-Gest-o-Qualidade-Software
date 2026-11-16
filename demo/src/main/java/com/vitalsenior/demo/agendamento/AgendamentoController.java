package com.vitalsenior.demo.agendamento;

import com.vitalsenior.demo.aula.AulaRepo;
import com.vitalsenior.demo.usuario.UsuarioRepo;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/vitalsenior/agendamentos")
public class AgendamentoController {

    @Autowired
    private AgendamentoRepo agendamentoRepo;

    @Autowired
    private UsuarioRepo usuarioRepo;

    @Autowired
    private AulaRepo aulaRepo;

    @PostMapping
    public ResponseEntity<?> agendar(@RequestBody @Valid DadosCadastroAgendamento dados) {
        if (agendamentoRepo.existsByAlunoIdUsuarioAndAulaIdAula(dados.idAluno(), dados.idAula())) {
            return ResponseEntity.badRequest().body("Aluno já agendado nesta aula.");
        }

        var aluno = usuarioRepo.findById(dados.idAluno())
                .orElseThrow(() -> new RuntimeException("Aluno não encontrado"));
        var aula = aulaRepo.findById(dados.idAula())
                .orElseThrow(() -> new RuntimeException("Aula não encontrada"));

        Agendamento agendamento = new Agendamento(aluno, aula);
        agendamentoRepo.save(agendamento);

        return ResponseEntity.status(HttpStatus.CREATED).body(new DadosListagemAgendamento(agendamento));
    }

    @GetMapping("/aluno/{idAluno}")
    public ResponseEntity<List<DadosListagemAgendamento>> listarPorAluno(@PathVariable Integer idAluno) {
        var lista = agendamentoRepo.findByAlunoIdUsuario(idAluno)
                .stream().map(DadosListagemAgendamento::new).toList();
        return ResponseEntity.ok(lista);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> cancelar(@PathVariable Integer id) {
        return agendamentoRepo.findById(id).map(ag -> {
            ag.setStatusAgendamento("CANCELADO");
            agendamentoRepo.save(ag);
            return ResponseEntity.noContent().<Void>build();
        }).orElse(ResponseEntity.notFound().build());
    }
}
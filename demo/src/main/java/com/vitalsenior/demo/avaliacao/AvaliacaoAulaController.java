package com.vitalsenior.demo.avaliacao;

import com.vitalsenior.demo.agendamento.AgendamentoRepo;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/vitalsenior/avaliacoes")
public class AvaliacaoAulaController {

    @Autowired
    private AvaliacaoAulaRepo avaliacaoRepo;

    @Autowired
    private AgendamentoRepo agendamentoRepo;

    @PostMapping
    public ResponseEntity<?> avaliar(@RequestBody @Valid DadosCadastroAvaliacao dados) {
        if (avaliacaoRepo.findByAgendamentoIdAgendamento(dados.idAgendamento()).isPresent()) {
            return ResponseEntity.badRequest().body("Este agendamento já foi avaliado.");
        }

        var agendamento = agendamentoRepo.findById(dados.idAgendamento())
                .orElseThrow(() -> new RuntimeException("Agendamento não encontrado"));

        AvaliacaoAula avaliacao = new AvaliacaoAula(dados, agendamento);
        avaliacaoRepo.save(avaliacao);

        return ResponseEntity.status(HttpStatus.CREATED).body(new DadosListagemAvaliacao(avaliacao));
    }

    @GetMapping("/agendamento/{idAgendamento}")
    public ResponseEntity<DadosListagemAvaliacao> buscarPorAgendamento(@PathVariable Integer idAgendamento) {
        return avaliacaoRepo.findByAgendamentoIdAgendamento(idAgendamento)
                .map(av -> ResponseEntity.ok(new DadosListagemAvaliacao(av)))
                .orElse(ResponseEntity.notFound().build());
    }
}
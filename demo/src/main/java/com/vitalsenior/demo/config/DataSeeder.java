package com.vitalsenior.demo.config;

import com.vitalsenior.demo.aula.Aula;
import com.vitalsenior.demo.aula.AulaRepo;
import com.vitalsenior.demo.exercicio.Exercicio;
import com.vitalsenior.demo.exercicio.ExercicioRepo;
import com.vitalsenior.demo.local.LocalExercicio;
import com.vitalsenior.demo.local.LocalExercicioRepo;
import com.vitalsenior.demo.usuario.Usuario;
import com.vitalsenior.demo.usuario.UsuarioRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Configuration
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private UsuarioRepo usuarioRepo;

    @Autowired
    private LocalExercicioRepo localRepo;

    @Autowired
    private AulaRepo aulaRepo;

    @Autowired
    private ExercicioRepo exercicioRepo;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        // 1. Seed de Usuários padrão (Professor e Aluno)
        if (usuarioRepo.count() == 0) {
            Usuario professor = new Usuario();
            professor.setNome("Ana Costa");
            professor.setEmail("ana@vitalsenior.com");
            professor.setTelefone("(11) 99999-1111");
            professor.setDataNascimento(LocalDate.of(1988, 5, 14));
            professor.setTipoPerfil("PROFISSIONAL");
            professor.setSenhaHash(passwordEncoder.encode("123456"));
            usuarioRepo.save(professor);

            Usuario aluno = new Usuario();
            aluno.setNome("José da Silva");
            aluno.setEmail("jose@vitalsenior.com");
            aluno.setTelefone("(11) 98888-2222");
            aluno.setDataNascimento(LocalDate.of(1956, 8, 22));
            aluno.setTipoPerfil("ALUNO");
            aluno.setSenhaHash(passwordEncoder.encode("123456"));
            usuarioRepo.save(aluno);

            // 2. Seed de Locais no Mapa (Aclimação e Parque do Carmo)
            // 2. Seed de Locais no Mapa (Parque da Mooca e CEE Salim Farah Maluf)
            LocalExercicio parqueMooca = new LocalExercicio();
            parqueMooca.setNome("Parque da Mooca");
            parqueMooca.setDescricao("Ponto de encontro acessível próximo aos bancos e pista de caminhada plana.");
            parqueMooca.setLogradouro("Av. Paes de Barros, 3107 - Mooca");
            parqueMooca.setStatus("ATIVO");
            parqueMooca.setCep("03149-100");
            parqueMooca.setLatitude(new BigDecimal("-23.569400"));
            parqueMooca.setLongitude(new BigDecimal("-46.588200"));
            localRepo.save(parqueMooca);

            LocalExercicio ceeSalim = new LocalExercicio();
            ceeSalim.setNome("CEE Salim Farah Maluf");
            ceeSalim.setDescricao("Centro Educacional e Esportivo com quadras cobertas e rampas de acesso.");
            ceeSalim.setLogradouro("Rua Three Rivers, 55 - Mooca");
            ceeSalim.setStatus("ATIVO");
            ceeSalim.setCep("03182-040");
            ceeSalim.setLatitude(new BigDecimal("-23.560800"));
            ceeSalim.setLongitude(new BigDecimal("-46.596500"));
            localRepo.save(ceeSalim);

            // 3. Seed de Aulas na semana atual vinculadas aos novos locais
            Aula aula1 = new Aula();
            aula1.setProfessor(professor);
            aula1.setLocal(parqueMooca);
            aula1.setTitulo("Alongamento suave no parque");
            aula1.setDescricao("Mobilidade articular e respiração guiada.");
            aula1.setDataHoraInicio(LocalDateTime.now().plusDays(1).withHour(9).withMinute(0).withSecond(0));
            aula1.setDataHoraFinal(LocalDateTime.now().plusDays(1).withHour(10).withMinute(0).withSecond(0));
            aula1.setStatus("AGENDADA");
            aulaRepo.save(aula1);

            Aula aula2 = new Aula();
            aula2.setProfessor(professor);
            aula2.setLocal(ceeSalim);
            aula2.setTitulo("Caminhada e equilíbrio");
            aula2.setDescricao("Atividade assistida em ritmo leve na pista do CEE.");
            aula2.setDataHoraInicio(LocalDateTime.now().plusDays(2).withHour(16).withMinute(0).withSecond(0));
            aula2.setDataHoraFinal(LocalDateTime.now().plusDays(2).withHour(17).withMinute(0).withSecond(0));
            aula2.setStatus("AGENDADA");
            aulaRepo.save(aula2);
        }

        // 4. Seed de Exercícios Gravados (Vídeos do YouTube)
        if (exercicioRepo.count() == 0) {
            Exercicio video1 = new Exercicio();
            video1.setTitulo("Exercicio para pernas");
            video1.setDescricao("12 min • Nível leve • Em pé");
            video1.setNivelDificuldade("Em pé");
            video1.setInstrucoes("Realize os movimentos lentamente sem forçar.");
            video1.setPrecaucoes("Pare imediatamente se sentir dor, tontura ou falta de ar.");
            video1.setStatus("ATIVO");
            video1.setUrl("Cc5Z1Fun5nc?si=i4dKOiMOsNtvPgMP");
            exercicioRepo.save(video1);
        }
    }
}
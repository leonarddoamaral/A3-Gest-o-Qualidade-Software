# 💻 A3 - Gestão e Qualidade de Software: Sistema Mobile Web de Exercícios para a Terceira Idade

> **Instituição:** Universidade São Judas Tadeu  
> **Curso:** Bacharelado em Sistemas de Informação  
> **Disciplina:** Gestão e Qualidade de Software / Engenharia de Software (A3)  
> **Tema:** Solução Computacional para Saúde, Mobilidade Urbana e Preservação do Meio Ambiente Urbano

---

## 👥 Integrantes e Responsabilidades

| Nome | RA | Responsabilidade Principal |
|------|----|----------------------------|
| **Leonardo do Amaral Quinquio** | *824143195* | Modelagem e Implementação de Software[cite: 2] |
| **Luighi Cordeiro Gaspareto** | *[Insira o RA]* | Documentação do Sistema e Engenharia de Requisitos[cite: 2] |
| **Henrique Matias de Oliveira** | *[Insira o RA]* | Documentação, Gerenciamento de Projeto e Requisitos[cite: 2] |
| **Enzo Yukio Yoshida** | *[Insira o RA]* | Modelagem de Software e Implementação[cite: 2] |
| **Guilherme Sales de Andrade** | *[Insira o RA]* | Engenharia de Requisitos e Implementação[cite: 2] |

---

## 🔗 Links Úteis e Documentação

* 📌 **Gerenciamento Ágil (Jira):** [Board do Projeto no Jira](https://leonarddoamaral.atlassian.net/jira/software/projects/SCRUM/boards/1?filter=&groupBy=none&atlOrigin=eyJpIjoiMjQ4YjY2YWE0N2Q4NDk5YjlhOGFhMjg0YmNhMjMyMzIiLCJwIjoiaiJ9)
* 📄 **Documentação Técnica do Projeto:** [Google Docs Document](https://docs.google.com/document/d/1hpNqKnNYzCt4uGbLoLLl9dWYgMm7M_wSo3EddKcJpcA/edit?usp=sharing)

---

## 📃 Sobre o Projeto

O projeto consiste no desenvolvimento de um **sistema mobile web** voltado para a terceira idade e pessoas com mobilidade reduzida. A aplicação visa combater o sedentarismo e o isolamento social por meio da prática guiada de exercícios físicos, prioritariamente ao ar livre, além de viabilizar o agendamento de aulas presenciais ministradas por profissionais de educação física em parques e praças públicas e disponibilizar treinos gravados para acesso offline.

### 🌱 Alinhamento Ambiental, Social e ODS (ONU)
Atendendo às diretrizes da A3 e aos Objetivos de Desenvolvimento Sustentável (ODS) da ONU:
* **Problema Enfrontado:** Subutilização e degradação de praças e parques urbanos, combinadas ao sedentarismo e isolamento social da população idosa.
* **ODS 3 (Saúde e Bem-Estar):** Redução da incidência de doenças crônicas (como diabetes, patologias cardiovasculares e osteoporose), prevenção de quedas e suporte à saúde mental.
* **ODS 11 (Cidades e Comunidades Sustentáveis):** Estímulo à ocupação ativa, valorização e conservação do meio ambiente urbano e parques públicos.
* **ODS 13 (Ação Contra a Mudança Global do Clima):** Promoção do uso de transportes sustentáveis/ativos no deslocamento até as praças.

---

## 🔄 Metodologia, Ciclo de Vida e Ferramentas

O projeto utiliza a combinação das metodologias ágeis **Scrum e Kanban** integradas ao ciclo de vida de desenvolvimento de software:

| Etapa do Ciclo de Vida | Processo | Ferramentas Utilizadas |
|------------------------|----------|------------------------|
| **Planejamento & Análise** | Levantamento de requisitos, especificação de escopo e Sprints semanais. | Jira e Microsoft Teams |
| **Projeto (Design & Arquitetura)** | Definição da arquitetura, prototipagem UI/UX navegável e diagramação UML. | Figma e Draw.io |
| **Programação & Codificação** | Desenvolvimento Mobile Web seguindo padrões de Clean Code. | IDE (VS Code) e GitHub |
| **Testes e Qualidade** | Aplicação de testes unitários em ambiente de homologação. | Ambiente de Homologação |
| **Implantação (Deployment)** | Automação de deploy via pipelines CI/CD em ambiente de nuvem. | Cloud Infrastructure & CI/CD Pipelines |
| **Manutenção & Monitoramento** | Acompanhamento de métricas, erros em tempo real e melhoria contínua. | Ferramentas de APM |

---

## 📐 Engenharia de Requisitos

### Requisitos Funcionais (RF)

* **RF-01: Cadastro de Usuário**  
  O sistema deve permitir o cadastro de novos usuários solicitando obrigatoriamente: Nome completo, Data de nascimento, Local de Residência (endereço/CEP), E-mail e senha.  
  A tela de cadastro deve incluir o aceite obrigatório dos Termos de Uso e da Política de Privacidade para garantia de conformidade com a LGPD.

* **RF-02: Autenticação de Usuário**  
  O sistema deve permitir a autenticação (login) dos usuários cadastrados informando E-mail (ou nome completo) e senha.

* **RF-03: Controle de perfis de acesso**  
  O sistema deve gerenciar três perfis de acesso com permissões específicas: Aluno (idoso/pessoa com mobilidade reduzida), Professor (profissional de educação física) e Administrador.

* **RF-04: Gestão de locais públicos para exercícios**  
  O sistema deve permitir ao Administrador o cadastramento, edição e remoção de espaços públicos urbanos destinados às aulas.

* **RF-05: Recomendação por Geolocalização**  
  O sistema deve detectar a localização do aluno e recomendar locais públicos cadastrados mais próximos.  
  O sistema deve disponibilizar informações detalhadas do local, incluindo endereço completo, trajeto, tempo estimado de percurso e opções de modalidade de transporte (a pé, carro ou ônibus).

* **RF-06: Agendamento, Reagendamento e Cancelamento de aulas**  
  O sistema deve permitir ao aluno realizar o agendamento de aulas nos locais públicos e horários disponíveis.  
  O sistema deve permitir que o aluno e/ou professor cancelem ou reagendem aulas previamente marcadas.  
  O sistema deve sugerir novas datas e horários disponíveis em caso de cancelamento.

* **RF-07: Painel/Dashboard de aulas do dia**  
  O sistema deve apresentar uma tela inicial/painel mostrando a data atual, dia da semana, lista de aulas a serem realizadas no dia, a indicação do local correspondente e a condição de previsão do tempo (ex: temperatura e clima).

* **RF-08: Ficha de Mobilidade e Anamnese**  
  O sistema deve permitir o preenchimento e a visualização de uma ficha de mobilidade e sensibilidade do aluno, registrando restrições físicas e níveis de sensibilidade para orientação das aulas.  
  O sistema deve permitir o cadastro opcional de um número de telefone de contato emergencial (familiar ou cuidador).

* **RF-09: Catálogo de Exercícios com mídia**  
  O sistema deve disponibilizar uma biblioteca de exercícios com imagens explicativas e vídeos demonstrativos das atividades.  
  O sistema deve permitir o download prévio dos vídeos de exercícios para acesso offline, evitando consumo excessivo da rede de dados móveis.

* **RF-10: Histórico de Frequência e Indicadores**  
  O sistema deve registrar e exibir ao aluno o seu histórico de frequência, contabilizando a quantidade de aulas realizadas e não realizadas no mês e os locais públicos frequentados.

* **RF-11: Feedback e Avaliação pós-aula**  
  O sistema deve disponibilizar ao final de cada aula uma tela de avaliação rápida contendo 3 perguntas interativas respondidas via ícones de emojis:  
  1- Gostou da aula?  
  2- Teve dificuldade nos exercícios?  
  3- Alguma reclamação?

* **RF-12: Envio de lembretes e Notificações**  
  O sistema deve emitir notificações automáticas para lembrar o aluno sobre seus agendamentos de aulas e alertas imediatos em caso de cancelamento por parte do professor.

---

### Requisitos Não Funcionais (RNF)

* **RNF-01: Usabilidade e Acessibilidade para terceira idade**  
  A interface mobile web deve ser projetada focando no público idoso e com mobilidade reduzida, utilizando tipografia de fácil leitura, botões espaçados e de alto contraste, menus simplificados e fluxo de avaliação intuitivo baseado em emojis e confirmação dupla para ações críticas (como o cancelamento de aulas).  
  O sistema deve fornecer feedback sonoro suave ou tátil (vibração do dispositivo) ao confirmar ações na interface.

* **RNF-02: Restrição de Mídia e duração dos vídeos**  
  Os vídeos autoexplicativos devem ter duração máxima de 5 minutos para garantir engajamento e não sobrecarregar o consumo de dados móveis.

* **RNF-03: Requisito de Conectividade**  
  O aplicativo mobile web deve exigir conexão ativa à internet (Wi-Fi ou dados móveis) para autenticação, sincronização de agendamentos e carregamento das rotas dos mapas.

* **RNF-04: Desempenho no Carregamento**  
  A visualização da agenda do dia e a consulta aos locais próximos devem ter tempo de resposta inferior a 3 segundos em conexões padrão.

* **RNF-05: Integração com serviços de mapas**  
  O sistema deve integrar-se a APIs de geolocalização e rotas para fornecer cálculo preciso do tempo de percurso e opções de transporte (a pé, carro, ônibus), bem como a serviços de previsão do tempo.

* **RNF-06: Segurança e Proteção de dados sensíveis**  
  Todas as credenciais de acesso (senhas) e dados sensíveis de saúde e localização do aluno devem ser armazenados de forma criptografada, atendendo aos padrões da LGPD.

---

## ⚙️ Regras de Negócio (RN)

* **RN-01: Frequência do envio de lembretes**  
  As notificações/lembretes de aulas agendadas deverão ser enviadas em dois momentos específicos:  
  1- 1 dia (24 horas) antes da data da aula.  
  2- 2 horas antes do horário do início da aula.

* **RN-02: Raio de busca para locais próximos**  
  O algoritmo de recomendação de praças/parques deve priorizar locais localizados numa distância entre 5 km e 10 km a partir do ponto de residência ou localização atual do aluno.

* **RN-03: Cancelamento por condições climáticas adversas**  
  Por se tratar de atividades presenciais ao ar livre em praças e parques, o professor possui permissão para cancelar a aula em caso de chuva ou temperaturas extremas, devendo o sistema notificar imediatamente todos os alunos inscritos.

CREATE TABLE local_exercicio (
                                 id_local SERIAL PRIMARY KEY,
                                 nome VARCHAR(150) NOT NULL,
                                 descricao TEXT,
                                 logradouro VARCHAR(255),
                                 status VARCHAR(30) DEFAULT 'ATIVO',
                                 cep VARCHAR(15),
                                 latitude NUMERIC(10, 8) NOT NULL,
                                 longitude NUMERIC(11, 8) NOT NULL
);

-- 4. Tabela de Aulas Presenciais / Online
CREATE TABLE aula (
                      id_aula SERIAL PRIMARY KEY,
                      id_professor INTEGER NOT NULL,
                      id_local INTEGER NOT NULL,
                      titulo VARCHAR(150) NOT NULL,
                      descricao TEXT,
                      data_hora_inicio TIMESTAMP NOT NULL,
                      data_hora_final TIMESTAMP NOT NULL,
                      status VARCHAR(30) DEFAULT 'AGENDADA',
                      motivo_cancelamento TEXT,
                      CONSTRAINT fk_aula_professor FOREIGN KEY (id_professor) REFERENCES usuario(id_usuario),
                      CONSTRAINT fk_aula_local FOREIGN KEY (id_local) REFERENCES local_exercicio(id_local)
);

-- 5. Tabela de Agendamentos (Inscrição do Aluno na Aula)
CREATE TABLE agendamento (
                             id_agendamento SERIAL PRIMARY KEY,
                             id_aluno INTEGER NOT NULL,
                             id_aula INTEGER NOT NULL,
                             data_solicitacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                             status_agendamento VARCHAR(30) DEFAULT 'CONFIRMADO',
                             status_presenca VARCHAR(30) DEFAULT 'PENDENTE',
                             CONSTRAINT fk_agendamento_aluno FOREIGN KEY (id_aluno) REFERENCES usuario(id_usuario),
                             CONSTRAINT fk_agendamento_aula FOREIGN KEY (id_aula) REFERENCES aula(id_aula),
                             CONSTRAINT uk_aluno_aula UNIQUE (id_aluno, id_aula) -- Evita agendamento duplicado na mesma aula
);

-- 6. Tabela de Exercícios Gravados (Vídeos YouTube)
CREATE TABLE exercicio (
                           id_exercicio SERIAL PRIMARY KEY,
                           titulo VARCHAR(150) NOT NULL,
                           descricao TEXT,
                           nivel_dificuldade VARCHAR(50),
                           instrucoes TEXT,
                           precaucoes TEXT,
                           status VARCHAR(30) DEFAULT 'ATIVO',
                           url VARCHAR(255) NOT NULL -- ID do vídeo do YouTube (ex: 'V2_5G2Y3kXw')
);

-- 7. Tabela de Avaliação Pós-Aula
CREATE TABLE avaliacao_aula (
                                id_avaliacao SERIAL PRIMARY KEY,
                                id_agendamento INTEGER UNIQUE NOT NULL,
                                avaliacao_experiencia INTEGER CHECK (avaliacao_experiencia BETWEEN 1 AND 5),
                                avaliacao_dificuldade INTEGER CHECK (avaliacao_dificuldade BETWEEN 1 AND 5),
                                relato_problema TEXT,
                                data_avaliacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                CONSTR
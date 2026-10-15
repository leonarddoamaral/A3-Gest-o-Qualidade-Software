CREATE TABLE Usuario (
                         idUsuario SERIAL PRIMARY KEY,
                         nome VARCHAR(255) NOT NULL,
                         email VARCHAR(255) NOT NULL UNIQUE,
                         senhaHash VARCHAR(255) NOT NULL,
                         telefone VARCHAR(20),
                         dataNascimento DATE,
                         tipoPerfil VARCHAR(50) NOT NULL
);
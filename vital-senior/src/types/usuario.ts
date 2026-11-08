export type UsuarioLogin = {
    email: string;
    senha: string;
};

export type DadosCadastroUsuario = {
    nome: string;
    email: string;
    telefone: string;
    dataNascimento: string;
    tipoPerfil: string;
    senhaHash: string;
};

export type Usuario = {
    id: number;
    nome: string;
    email: string;
    telefone: string;
    dataNascimento: string;
    tipoPerfil: string;
    senhaHash: string;
}; 


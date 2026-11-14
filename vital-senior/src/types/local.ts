export type DadosCadastroLocal = {
    nome: string;
    descricao: string;
    logradouro: string;
    status?: string;
    cep: string;
    latitude: number;
    longitude: number;
};

export type DadosListagemLocal = {
    idLocal: number;
    nome: string;
    descricao: string;
    logradouro: string;
    status: string;
    cep: string;
    latitude: number;
    longitude: number;
};
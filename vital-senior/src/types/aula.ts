import type { DadosListagemLocal } from './local';

export type DadosCadastroAula = {
    idProfessor: number;
    idLocal: number;
    titulo: string;
    descricao: string;
    dataHoraInicio: string;
    dataHoraFinal: string;
};

export type DadosListagemAula = {
    idAula: number;
    titulo: string;
    descricao: string;
    dataHoraInicio: string;
    dataHoraFinal: string;
    status: string;
    nomeProfessor: string;
    local: DadosListagemLocal;
};
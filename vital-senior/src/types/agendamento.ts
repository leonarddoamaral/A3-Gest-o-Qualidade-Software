import type { DadosListagemAula } from './aula';

export type DadosCadastroAgendamento = {
    idAluno: number;
    idAula: number;
};

export type DadosListagemAgendamento = {
    idAgendamento: number;
    dataSolicitacao: string;
    statusAgendamento: string;
    statusPresenca: string;
    aula: DadosListagemAula;
};
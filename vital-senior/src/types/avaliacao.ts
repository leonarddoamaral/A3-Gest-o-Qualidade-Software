export type DadosCadastroAvaliacao = {
    idAgendamento: number;
    avaliacaoExperiencia: number;
    avaliacaoDificuldade: number;
    relatoProblema: string;
};

export type DadosListagemAvaliacao = {
    idAvaliacao: number;
    idAgendamento: number;
    avaliacaoExperiencia: number;
    avaliacaoDificuldade: number;
    relatoProblema: string;
    dataAvaliacao: string;
};
export type DadosCadastroExercicio = {
    titulo: string;
    descricao: string;
    nivelDificuldade: string;
    instrucoes: string;
    precaucoes: string;
    status?: string;
    url: string;
};

export type DadosListagemExercicio = {
    idExercicio: number;
    titulo: string;
    descricao: string;
    nivelDificuldade: string;
    instrucoes: string;
    precaucoes: string;
    status: string;
    url: string;
};
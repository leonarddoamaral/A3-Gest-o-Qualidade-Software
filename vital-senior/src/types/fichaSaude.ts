export type DadosCadastroFichaSaude = {
    idUsuario: number;
    doresPeitoTontura: boolean;
    historicoQuedas: boolean;
    problemasArticulacoes: boolean;
    nomeContatoEmergencia: string;
    telefoneEmergencia: string;
};

export type DadosListagemFichaSaude = {
    idFicha: number;
    doresPeitoTontura: boolean;
    historicoQuedas: boolean;
    problemasArticulacoes: boolean;
    nomeContatoEmergencia: string;
    telefoneEmergencia: string;
    usuarioId: number;
};
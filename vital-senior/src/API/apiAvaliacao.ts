import type { DadosCadastroAvaliacao, DadosListagemAvaliacao } from '../types/avaliacao';

const BASE_URL = 'http://localhost:8081/vitalsenior/avaliacoes';

export async function cadastrarAvaliacao(dados: DadosCadastroAvaliacao): Promise<DadosListagemAvaliacao> {
    const response = await fetch(`${BASE_URL}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(dados),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Erro ao enviar avaliação');
    }

    return response.json();
}

export async function buscarAvaliacaoPorAgendamento(idAgendamento: number): Promise<DadosListagemAvaliacao> {
    const response = await fetch(`${BASE_URL}/agendamento/${idAgendamento}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
        throw new Error('Erro ao buscar avaliação do agendamento');
    }

    return response.json();
}
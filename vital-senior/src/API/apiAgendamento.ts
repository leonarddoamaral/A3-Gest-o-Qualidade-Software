import type { DadosCadastroAgendamento, DadosListagemAgendamento } from '../types/agendamento';

const BASE_URL = 'http://localhost:8081/vitalsenior/agendamentos';

export async function cadastrarAgendamento(dados: DadosCadastroAgendamento): Promise<DadosListagemAgendamento> {
    const response = await fetch(`${BASE_URL}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(dados),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Erro ao realizar agendamento');
    }

    return response.json();
}

export async function listarAgendamentosPorAluno(idAluno: number): Promise<DadosListagemAgendamento[]> {
    const response = await fetch(`${BASE_URL}/aluno/${idAluno}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
        throw new Error('Erro ao buscar agendamentos do aluno');
    }

    return response.json();
}

export async function cancelarAgendamento(id: number): Promise<void> {
    const response = await fetch(`${BASE_URL}/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
        throw new Error('Erro ao cancelar agendamento');
    }
}
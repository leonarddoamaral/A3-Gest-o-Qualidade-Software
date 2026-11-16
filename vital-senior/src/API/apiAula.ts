import type { DadosCadastroAula, DadosListagemAula } from '../types/aula';

const BASE_URL = 'http://localhost:8081/vitalsenior/aulas';

export async function cadastrarAula(dados: DadosCadastroAula): Promise<DadosListagemAula> {
    const response = await fetch(`${BASE_URL}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(dados),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Erro ao cadastrar aula');
    }

    return response.json();
}

export async function listarAulas(): Promise<DadosListagemAula[]> {
    const response = await fetch(`${BASE_URL}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
        throw new Error('Erro ao listar aulas');
    }

    return response.json();
}

export async function buscarAulaPorId(id: number): Promise<DadosListagemAula> {
    const response = await fetch(`${BASE_URL}/${id}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
        throw new Error('Erro ao buscar dados da aula');
    }

    return response.json();
}

export async function cancelarAula(id: number, motivo: string): Promise<void> {
    const response = await fetch(`${BASE_URL}/${id}/cancelar`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'text/plain' },
        body: motivo,
    });

    if (!response.ok) {
        throw new Error('Erro ao cancelar aula');
    }
}
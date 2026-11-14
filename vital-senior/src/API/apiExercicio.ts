import type { DadosCadastroExercicio, DadosListagemExercicio } from '../types/exercicio';

const BASE_URL = 'http://localhost:8081/vitalsenior/exercicios';

export async function cadastrarExercicio(dados: DadosCadastroExercicio): Promise<DadosListagemExercicio> {
    const response = await fetch(`${BASE_URL}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(dados),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Erro ao cadastrar exercício');
    }

    return response.json();
}

export async function listarExercicios(): Promise<DadosListagemExercicio[]> {
    const response = await fetch(`${BASE_URL}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
        throw new Error('Erro ao listar exercícios');
    }

    return response.json();
}

export async function buscarExercicioPorId(id: number): Promise<DadosListagemExercicio> {
    const response = await fetch(`${BASE_URL}/${id}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
        throw new Error('Erro ao buscar dados do exercício');
    }

    return response.json();
}
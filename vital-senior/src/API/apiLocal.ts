import type { DadosCadastroLocal, DadosListagemLocal } from '../types/local';

const BASE_URL = 'http://localhost:8081/vitalsenior/locais';

export async function cadastrarLocal(dados: DadosCadastroLocal): Promise<DadosListagemLocal> {
    const response = await fetch(`${BASE_URL}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(dados),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Erro ao cadastrar local');
    }

    return response.json();
}

export async function listarLocais(): Promise<DadosListagemLocal[]> {
    const response = await fetch(`${BASE_URL}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
        throw new Error('Erro ao listar locais');
    }

    return response.json();
}

export async function buscarLocalPorId(id: number): Promise<DadosListagemLocal> {
    const response = await fetch(`${BASE_URL}/${id}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
        throw new Error('Erro ao buscar dados do local');
    }

    return response.json();
}
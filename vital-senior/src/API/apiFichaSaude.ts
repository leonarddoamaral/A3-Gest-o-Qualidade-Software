import type { DadosCadastroFichaSaude } from '../types/fichaSaude';

const BASE_URL = 'http://localhost:8081/vitalsenior/fichasaude';

export async function cadastrarFichaSaude(dados: DadosCadastroFichaSaude): Promise<DadosCadastroFichaSaude> {
    const response = await fetch(`${BASE_URL}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(dados),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Erro ao cadastrar ficha de saúde');
    }

    return response.json();
}

export async function buscarFichaPorUsuario(idUsuario: number): Promise<DadosCadastroFichaSaude> {
    const response = await fetch(`${BASE_URL}/usuario/${idUsuario}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
        throw new Error('Ficha não encontrada');
    }

    return response.json();
}
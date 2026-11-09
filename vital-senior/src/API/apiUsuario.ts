import type { UsuarioLogin, DadosCadastroUsuario, Usuario} from '../types/usuario';

const BASE_URL = 'http://localhost:8081/vitalsenior/usuario'; 

export async function loginUsuario(dados: UsuarioLogin) {
    const response = await fetch(`${BASE_URL}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(dados),
    });

    if (!response.ok) {
        throw new Error('Credenciais inválidas');
    }
    
    // Agora lê a resposta como JSON (o seu dadosListagemUsuario)
    return response.json(); 
}

export async function cadastrarUsuario(dados: DadosCadastroUsuario): Promise<Usuario> {
    const response = await fetch(`${BASE_URL}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(dados),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Erro ao cadastrar usuário');
    }

    return response.json();
}

export async function buscarUsuarioPorId(id: number) {
    const response = await fetch(`${BASE_URL}/${id}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    });

    if (!response.ok) {
        throw new Error('Erro ao buscar dados do usuário');
    }
    
    return response.json(); // O Spring devolve o DadosListagemUsuario em JSON
}
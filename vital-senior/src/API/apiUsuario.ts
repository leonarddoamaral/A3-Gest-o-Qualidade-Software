import type { UsuarioLogin, DadosCadastroUsuario, Usuario} from '../types/usuario';

const BASE_URL = 'http://localhost:8081/vitalsenior/usuario'; 

export async function loginUsuario(dados: UsuarioLogin): Promise<string> {
    const response = await fetch(`${BASE_URL}login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(dados),
    });


    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Erro de autenticação');
    }
    return response.text();
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

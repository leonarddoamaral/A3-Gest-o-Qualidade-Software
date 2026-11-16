import React from 'react';
import Button from '../../components/button/button';
import { Link, useNavigate } from 'react-router-dom';
import './cadastroUsuario.css';
import Input from '../../components/input/input';
import { cadastrarUsuario } from '../../API/apiUsuario';

function CadastroUsuario() {
  const [nome, setNome] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [telefone, setTelefone] = React.useState('');
  const [dataNascimento, setDataNascimento] = React.useState('');
  const [senhaHash, setSenhaHash] = React.useState('');
  const [tipoPerfil, setTipoPerfil] = React.useState('');
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const navigate = useNavigate();

  const handleCadastro = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!nome || !email || !telefone || !dataNascimento || !senhaHash || !tipoPerfil) {
      setError('Por favor, preencha todos os campos.');
      setLoading(false);
      return;
    }

    try {
      const response: any = await cadastrarUsuario({
        nome,
        email,
        telefone,
        dataNascimento,
        senhaHash,
        tipoPerfil,
      });

      // Captura o ID independente se o DTO do Java serializa como 'idUsuario' ou 'id'
      const usuarioId = response.idUsuario ?? response.id;
      if (usuarioId) {
        localStorage.setItem('userId', String(usuarioId));
        localStorage.setItem('tipoPerfil', response.tipoPerfil || tipoPerfil);
      }

      if (tipoPerfil === 'ALUNO') {
        navigate('/cadastro/ficha-saude');
      } else {
        navigate('/login');
      }
    } catch (err) {
      console.error('Erro ao cadastrar usuário:', err);
      setError('Erro ao cadastrar usuário. Verifique se o e-mail já está em uso.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="app-container">
      {/* Cabeçalho de Navegação */}
      <header className="cadastro-header">
        <Link to="/login" className="back-button" aria-label="Voltar">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="m15 18-6-6 6-6" />
            <path d="M9 12h12" />
          </svg>
        </Link>
        <span className="app-name-dark">Vital Senior</span>
      </header>

      <section className="cadastro-content">
        <div className="cadastro-headings">
          <h1 className="cadastro-title">Crie sua conta</h1>
          <p className="cadastro-subtitle">
            Preencha seus dados para começar a cuidar da sua saúde conosco.
          </p>
        </div>

        {/* Formulário mapeado para o DTO do Spring Boot */}
        <form className="cadastro-form" onSubmit={handleCadastro}>
          <Input
            type="text"
            id="nome"
            placeholder="Digite seu nome completo"
            text="Nome Completo"
            onChange={(e) => setNome(e.target.value)}
          />
          <Input
            type="email"
            id="email"
            placeholder="Digite seu melhor e-mail"
            text="E-mail"
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            type="tel"
            id="telefone"
            placeholder="(00) 00000-0000"
            text="Telefone"
            onChange={(e) => setTelefone(e.target.value)}
          />
          <Input
            type="date"
            id="dataNascimento"
            placeholder=""
            text="Data de Nascimento"
            onChange={(e) => setDataNascimento(e.target.value)}
          />
          <Input
            type="password"
            id="senhaHash"
            placeholder="Crie uma senha segura"
            text="Senha"
            onChange={(e) => setSenhaHash(e.target.value)}
          />

          <div className="input-group">
            <label htmlFor="tipoPerfil">Tipo de Perfil</label>
            <select
              id="tipoPerfil"
              name="tipoPerfil"
              required
              value={tipoPerfil}
              onChange={(e) => setTipoPerfil(e.target.value)}
            >
              <option value="" disabled>
                Selecione seu perfil...
              </option>
              <option value="ALUNO">Sênior / Aluno</option>
              <option value="FAMILIAR">Familiar Responsável</option>
              <option value="PROFISSIONAL">Profissional de Saúde</option>
            </select>
          </div>

          {error && (
            <p style={{ color: '#DC2626', fontSize: '14px', fontWeight: 600, marginTop: '4px' }}>
              {error}
            </p>
          )}

          <div className="button-wrapper">
            <Button text={loading ? 'Cadastrando...' : 'CADASTRAR'} icon={null} type="submit" />
          </div>
        </form>

        <p className="login-prompt">
          Já tem uma conta? <Link to="/login">Entrar</Link>
        </p>
      </section>
    </main>
  );
}

export default CadastroUsuario;
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../components/button/button';
import Input from '../../components/input/input';
import Checkbox from '../../components/checkbox/checkbox';
import { cadastrarFichaSaude, buscarFichaPorUsuario } from '../../API/apiFichaSaude';
import './ficha.css';

function FichaSaude() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Estados para os campos de texto
  const [nomeContatoEmergencia, setNomeContatoEmergencia] = useState('');
  const [telefoneEmergencia, setTelefoneEmergencia] = useState('');

  // Estados para os checkboxes (booleanos)
  const [historicoQuedas, setHistoricoQuedas] = useState(false);
  const [doresPeitoTontura, setDoresPeitoTontura] = useState(false);
  const [problemasArticulacoes, setProblemasArticulacoes] = useState(false);

  // Carrega a ficha caso o usuário já tenha cadastrado anteriormente
  useEffect(() => {
    const usuarioId = localStorage.getItem('userId');
    if (!usuarioId) return;

    buscarFichaPorUsuario(Number(usuarioId))
      .then((ficha) => {
        if (ficha) {
          setNomeContatoEmergencia(ficha.nomeContatoEmergencia || '');
          setTelefoneEmergencia(ficha.telefoneEmergencia || '');
          setHistoricoQuedas(Boolean(ficha.historicoQuedas));
          setDoresPeitoTontura(Boolean(ficha.doresPeitoTontura));
          setProblemasArticulacoes(Boolean(ficha.problemasArticulacoes));
        }
      })
      .catch(() => {
        // Se retornar 404, significa que o usuário ainda não criou a ficha (fluxo normal)
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const usuarioId = localStorage.getItem('userId');
    if (!usuarioId) {
      alert('Sessão expirada. Faça login novamente.');
      navigate('/home');
      return;
    }

    setLoading(true);

    try {
      await cadastrarFichaSaude({
        idUsuario: Number(usuarioId),
        nomeContatoEmergencia,
        telefoneEmergencia,
        historicoQuedas,
        doresPeitoTontura,
        problemasArticulacoes,
      });

      alert('Ficha de saúde salva com sucesso!');
      navigate('/login');
    } catch (error: any) {
      console.error('Erro ao cadastrar ficha:', error);
      alert(error.message || 'Erro ao salvar ficha de saúde.');
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
          <h1 className="cadastro-title">Crie sua ficha de saúde</h1>
          <p className="cadastro-subtitle">
            Preencha seus dados para começar a cuidar da sua saúde conosco.
          </p>
        </div>

        {/* Formulário com onSubmit */}
        <form className="cadastro-form" onSubmit={handleSubmit}>
          <Input
            type="text"
            id="nomeContatoEmergencia"
            placeholder="Digite o nome completo"
            text="Nome do Contato de Emergência"
            onChange={(e) => setNomeContatoEmergencia(e.target.value)}
          />

          <Input
            type="tel"
            id="telefoneEmergencia"
            placeholder="(00) 00000-0000"
            text="Telefone de Emergência"
            onChange={(e) => setTelefoneEmergencia(e.target.value)}
          />

          {/* Sessão de Checkboxes */}
          <div
            className="checkbox-section"
            style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}
          >
            <Checkbox
              id="quedas"
              text="Já teve quedas?"
              checked={historicoQuedas}
              onChange={(e) => setHistoricoQuedas(e.target.checked)}
            />

            <Checkbox
              id="doresPeito"
              text="Possui dores no peito ou tontura?"
              checked={doresPeitoTontura}
              onChange={(e) => setDoresPeitoTontura(e.target.checked)}
            />

            <Checkbox
              id="problemasArticulacoes"
              text="Possui problemas nas articulações?"
              checked={problemasArticulacoes}
              onChange={(e) => setProblemasArticulacoes(e.target.checked)}
            />
          </div>

          <div className="button-wrapper" style={{ marginTop: '32px' }}>
            <Button text={loading ? 'SALVANDO...' : 'SALVAR FICHA'} icon={null} type="submit" />
          </div>
        </form>
      </section>
    </main>
  );
}

export default FichaSaude;
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../components/button/button';
import Input from '../../components/input/input';
import Checkbox from '../../components/checkbox/checkbox';
import './ficha.css';

function FichaSaude() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  // Estados para os campos de texto
  const [nomeContatoEmergencia, setNomeContatoEmergencia] = useState('');
  const [telefoneEmergencia, setTelefoneEmergencia] = useState('');
  
  // Estados para os checkboxes (booleanos)
  const [quedas, setQuedas] = useState(false);
  const [doresPeito, setDoresPeito] = useState(false);
  const [problemasArticulacoes, setProblemasArticulacoes] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Resgata o ID do usuário que guardámos no localStorage durante o Login
    const usuarioId = localStorage.getItem('userId');

    // DTO que será enviado ao Spring Boot
    const payload = {
      usuarioId: usuarioId ? parseInt(usuarioId) : null,
      nomeContatoEmergencia,
      telefoneEmergencia,
      quedas,
      doresPeito,
      problemasArticulacoes
    };

    try {
      console.log('Enviando dados para a API:', payload);
      
      // Aqui fará a chamada real para a sua API quando o endpoint estiver pronto
      // ex: await cadastrarFichaAnamnese(payload);

      // Após sucesso, redireciona para a Home
      navigate('/home');
    } catch (error) {
      console.error('Erro ao cadastrar ficha:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="app-container">
      
      {/* Cabeçalho de Navegação */}
      <header className="cadastro-header">
        <Link to="/home" className="back-button" aria-label="Voltar">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
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
            placeholder="Digite seu nome completo" 
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
          
          {/* Sessão de Checkboxes (Atenção ao checked e required={false}) */}
          <div className="checkbox-section" style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <Checkbox 
              id="quedas" 
              text="Já teve quedas?" 
              checked={quedas}
              onChange={(e) => setQuedas(e.target.checked)}
            />
            
            <Checkbox
              id="doresPeito"
              text="Possui dores no peito ou tontura?"
              checked={doresPeito}
              onChange={(e) => setDoresPeito(e.target.checked)}
            />
            
            <Checkbox 
              id="problemasArticulacoes" 
              text="Possui problemas nas articulações?" 
              checked={problemasArticulacoes}
              onChange={(e) => setProblemasArticulacoes(e.target.checked)}
            />
          </div>
          
          <div className="button-wrapper" style={{ marginTop: '32px' }}>
            <Button text={loading ? "SALVANDO..." : "SALVAR FICHA"} icon={null} type="submit" />
          </div>

        </form>
      </section>
      
    </main>
  );
}

export default FichaSaude;
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  CalendarCheck, 
  BarChart2, 
  PlayCircle, 
  Home as HomeIcon, 
  Calendar, 
  PlaySquare 
} from 'lucide-react';
import './home.css';
import ActionCard from '../../components/action-card/action-card';
import { buscarUsuarioPorId } from '../../API/apiUsuario';

function Home() {
  // Estado tipado para evitar erros de 'undefined' no HTML
  const [usuario, setUsuario] = useState<{ nome: string; iniciais: string } | null>(null);

  const [id, setId] = useState(() => {
    const savedId = localStorage.getItem('userId');
    return savedId ? parseInt(savedId) : 0;
});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregarDados() {
      try {
        const dados = await buscarUsuarioPorId(id);
     
        const nomes = dados.nome.trim().split(' ');
        const iniciais = nomes.length > 1 
          ? nomes[0][0] + nomes[nomes.length - 1][0] 
          : nomes[0][0];


        setUsuario({
          nome: nomes[0].toUpperCase(), 
          iniciais: iniciais.toUpperCase()
        });

      } catch (error) {
        console.error("Erro ao carregar Home:", error);
      } finally {
        setLoading(false);
      }
    }

    carregarDados();
  }, [id]);

  // Tela de carregamento enquanto o Spring Boot devolve os dados
  if (loading || !usuario) {
    return (
      <main className="app-container home-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <p>Carregando o seu perfil...</p>
      </main>
    );
  }

  return (
    <main className="app-container home-container">
      
      {/* Cabeçalho de Saudação */}
      <header className="home-header">
        <div className="header-texts">
          <h1 className="greeting-title">OLÁ, {usuario.nome}!</h1>
          <p className="greeting-subtitle">Como você está hoje?</p>
        </div>
        <div className="avatar-circle">
          {usuario.iniciais}
        </div>
      </header>

      {/* Conteúdo Principal */}
      <section className="home-content">
        <h2 className="section-title">O que deseja fazer?</h2>
        
        {/* Lista de Ações */}
        <div className="action-list">
            <ActionCard
              title="AULAS HOJE"
              description="2 atividades programadas"
              icon={<CalendarCheck size={24} />}
              link="/aulas"
              cor='icon-green'
            />
            <ActionCard 
                title="MEU PROGRESSO"
                description="Você se movimentou 4 d..."
                icon={<BarChart2 size={24} />}
                link="/progresso"
                cor='icon-orange'
            />
            <ActionCard 
                title="VÍDEOS GRAVADOS"
                description="Exercite-se em casa"
                icon={<PlayCircle size={24} />}
                link="/videos"
                cor='icon-blue'
            />
        </div>

        {/* Cartão de Destaque - Próxima Aula */}
        <div className="highlight-card">
          <div className="highlight-date">
            <span className="date-day">14</span>
            <span className="date-month">OUT</span>
          </div>
          <div className="highlight-info">
            <span className="highlight-badge">Próxima aula</span>
            <h3 className="highlight-title">Alongamento • 09:00</h3>
          </div>
        </div>
      </section>

      {/* Barra de Navegação Inferior */}
      <nav className="bottom-nav">
        <Link to="/home" className="nav-item active">
          <HomeIcon size={22} />
          <span>Início</span>
        </Link>
        <Link to="/agenda" className="nav-item">
          <Calendar size={22} />
          <span>Agenda</span>
        </Link>
        <Link to="/videos" className="nav-item">
          <PlaySquare size={22} />
          <span>Vídeos</span>
        </Link>
      </nav>

    </main>
  );
}

export default Home;
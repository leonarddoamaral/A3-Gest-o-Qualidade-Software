import { useState, useEffect } from 'react';
import { 
  CalendarCheck, 
  PlayCircle,
  PlusCircle
} from 'lucide-react';
import './home.css';
import ActionCard from '../../components/action-card/action-card';
import { buscarUsuarioPorId } from '../../API/apiUsuario';
import MenuBar from '../../components/menu-bar/menuBar';

function Home() {
  const [usuario, setUsuario] = useState<{
    nome: string;
    iniciais: string;
    tipoPerfil: string;
  } | null>(null);

  const [id] = useState(() => {
    const savedId = localStorage.getItem('userId');
    return savedId ? parseInt(savedId) : 0;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregarDados() {
      try {
        const dados = await buscarUsuarioPorId(id);

        const nomes = dados.nome.trim().split(' ');
        const iniciais =
          nomes.length > 1
            ? nomes[0][0] + nomes[nomes.length - 1][0]
            : nomes[0][0];

        const perfil = (dados.tipoPerfil || localStorage.getItem('tipoPerfil') || 'ALUNO').toUpperCase();
        localStorage.setItem('tipoPerfil', perfil);

        setUsuario({
          nome: nomes[0].toUpperCase(),
          iniciais: iniciais.toUpperCase(),
          tipoPerfil: perfil,
        });
      } catch (error) {
        console.error('Erro ao carregar Home:', error);
      } finally {
        setLoading(false);
      }
    }

    if (id > 0) {
      carregarDados();
    } else {
      setLoading(false);
    }
  }, [id]);

  if (loading || !usuario) {
    return (
      <main
        className="app-container home-container"
        style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
      >
        <p>Carregando o seu perfil...</p>
      </main>
    );
  }

  // Aceita tanto 'PROFISSIONAL' (do select de cadastro) quanto 'PROFESSOR' (dos testes do banco)
  const isProfessor =
    usuario.tipoPerfil === 'PROFISSIONAL' || usuario.tipoPerfil === 'PROFESSOR';

  return (
    <main className="app-container home-container">
      {/* Cabeçalho de Saudação */}
      <header className="home-header">
        <div className="header-texts">
          <h1 className="greeting-title">OLÁ, {usuario.nome}!</h1>
          <p className="greeting-subtitle">
            {isProfessor ? 'Gerencie suas turmas e aulas' : 'Como você está hoje?'}
          </p>
        </div>
        <div className="avatar-circle">{usuario.iniciais}</div>
      </header>

      {/* Conteúdo Principal */}
      <section className="home-content">
        <h2 className="section-title">O que deseja fazer?</h2>

        {/* Lista de Ações Dinâmica por Perfil */}
        <div className="action-list">
          <ActionCard
            title={isProfessor ? 'MINHAS TURMAS' : 'AULAS'}
            description={
              isProfessor
                ? 'Gerenciar aulas presenciais'
                : 'Ver atividades programadas'
            }
            icon={<CalendarCheck size={24} />}
            link={isProfessor ? '/professor/minhas-aulas' : '/minhas-aulas'}
            cor="icon-green"
          />

          {isProfessor && (
            <ActionCard
              title="CADASTRAR AULA"
              description="Publicar nova aula no mapa"
              icon={<PlusCircle size={24} />}
              link="/professor/cadastrar-aula"
              cor="icon-orange"
            />
          )}

          <ActionCard
            title="VÍDEOS GRAVADOS"
            description="Exercite-se em casa"
            icon={<PlayCircle size={24} />}
            link="/videos"
            cor="icon-blue"
          />
        </div>
      </section>

      <MenuBar activePage="home" />
    </main>
  );
}

export default Home;
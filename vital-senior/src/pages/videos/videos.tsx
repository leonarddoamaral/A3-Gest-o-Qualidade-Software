import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  SlidersHorizontal, 
  Play, 
  ChevronRight,
  MonitorPlay
} from 'lucide-react';
import MenuBar from '../../components/menu-bar/menuBar';
import { listarExercicios } from '../../API/apiExercicio';
import type { DadosListagemExercicio } from '../../types/exercicio';
import './video.css';

export default function Videos() {
  const [busca, setBusca] = useState('');
  const [categoriaAtiva, setCategoriaAtiva] = useState('Todos');
  const [videos, setVideos] = useState<DadosListagemExercicio[]>([]);
  const [carregando, setCarregando] = useState(true);

  const categorias = ['Todos', 'Sentado', 'Em pé'];

  useEffect(() => {
    listarExercicios()
      .then((dados) => {
        const ativos = dados.filter((ex) => ex.status === 'ATIVO');
        setVideos(ativos);
      })
      .catch((error) => console.error('Erro ao buscar exercícios:', error))
      .finally(() => setCarregando(false));
  }, []);

  // Lógica de Filtro Duplo (Texto da Busca + Categoria/Nível)
  const videosFiltrados = videos.filter((video) => {
    const passaNaBusca = video.titulo.toLowerCase().includes(busca.toLowerCase());
    const passaNaCategoria =
      categoriaAtiva === 'Todos' ||
      video.nivelDificuldade?.toLowerCase() === categoriaAtiva.toLowerCase();
    return passaNaBusca && passaNaCategoria;
  });

  return (
    <main className="app-container videos-container">
      {/* Cabeçalho */}
      <header className="videos-header">
        <div className="videos-title-wrapper">
          <div className="videos-icon">
            <MonitorPlay size={26} strokeWidth={2.5} />
          </div>
          <h1 className="videos-title">EXERCÍCIOS GRAVADOS</h1>
        </div>
      </header>

      <section className="videos-content">
        {/* Barra de Pesquisa e Filtros */}
        <div className="search-filter-container">
          <div className="search-bar">
            <Search size={20} className="search-icon-left" />
            <input
              type="text"
              placeholder="Buscar exercício"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="search-input"
            />
            <SlidersHorizontal size={20} className="search-icon-right" />
          </div>

          {/* Pílulas de Categoria */}
          <div className="category-pills">
            {categorias.map((categoria) => (
              <button
                key={categoria}
                className={`pill-btn ${categoriaAtiva === categoria ? 'active' : ''}`}
                onClick={() => setCategoriaAtiva(categoria)}
              >
                {categoria}
              </button>
            ))}
          </div>
        </div>

        {/* Lista de Vídeos */}
        <div className="video-list">
          {carregando ? (
            <p style={{ textAlign: 'center', color: '#64748B', padding: '24px 0' }}>
              Carregando exercícios...
            </p>
          ) : (
            videosFiltrados.map((video) => (
              <Link
                key={video.idExercicio}
                to={`/video/${video.idExercicio}`}
                className="video-card"
              >
                {/* Thumbnail gerada diretamente do ID do YouTube salvo no banco */}
                <div
                  className="video-thumbnail"
                  style={{
                    backgroundImage: `url(https://img.youtube.com/vi/${video.url}/hqdefault.jpg)`,
                  }}
                >
                  <div className="thumbnail-overlay"></div>
                  <span className="video-badge">
                    {video.nivelDificuldade?.toUpperCase() || 'EXERCÍCIO'}
                  </span>

                  <div className="play-button-circle">
                    <Play size={20} fill="currentColor" className="play-icon" />
                  </div>
                </div>

                {/* Informações do Vídeo */}
                <div className="video-info">
                  <div className="video-texts">
                    <h3>{video.titulo}</h3>
                    <p>{video.descricao}</p>
                  </div>
                  <ChevronRight size={20} className="video-chevron" />
                </div>
              </Link>
            ))
          )}

          {/* Estado Vazio */}
          {!carregando && videosFiltrados.length === 0 && (
            <div className="empty-state">
              <p>Nenhum exercício encontrado para "{busca}".</p>
            </div>
          )}
        </div>
      </section>

      <MenuBar activePage="videos" />
    </main>
  );
}
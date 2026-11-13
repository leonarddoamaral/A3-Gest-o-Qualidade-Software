import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  SlidersHorizontal, 
  Play, 
  ChevronRight,
  MonitorPlay // Ícone que representa os exercícios gravados
} from 'lucide-react';
import MenuBar from '../../components/menu-bar/menuBar';
import './video.css';

export default function Videos() {
  const [busca, setBusca] = useState('');
  const [categoriaAtiva, setCategoriaAtiva] = useState('Todos');

  const categorias = ['Todos', 'Sentado', 'Em pé'];

  // Dados estáticos baseados no protótipo do Figma
  const videosDados = [
    {
      id: 1,
      titulo: 'Alongamento para começar o dia',
      detalhes: '12 min - Nível leve',
      badge: 'MAIS ASSISTIDO',
      categoria: 'Em pé',
      imagemUrl: 'https://images.unsplash.com/photo-1576678927484-cc907957088c?auto=format&fit=crop&q=80&w=800'
    },
    {
      id: 2,
      titulo: 'Fortaleça pernas e equilíbrio',
      detalhes: '18 min - Com apoio de cadeira',
      badge: 'RECOMENDADO',
      categoria: 'Sentado',
      imagemUrl: 'https://images.unsplash.com/photo-1552674605-15cff24c00e2?auto=format&fit=crop&q=80&w=800'
    }
  ];

  // Lógica de Filtro Duplo (Texto da Busca + Categoria)
  const videosFiltrados = videosDados.filter((video) => {
    const passaNaBusca = video.titulo.toLowerCase().includes(busca.toLowerCase());
    const passaNaCategoria = categoriaAtiva === 'Todos' || video.categoria === categoriaAtiva;
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
          {videosFiltrados.map((video) => (
            <Link 
              key={video.id} 
              to={`/video/${video.id}`} // Exemplo de rota para assistir ao vídeo
              className="video-card"
            >
              {/* Thumbnail (Imagem de capa) */}
              <div 
                className="video-thumbnail" 
                style={{ backgroundImage: `url(${video.imagemUrl})` }}
              >
                <div className="thumbnail-overlay"></div>
                <span className="video-badge">{video.badge}</span>
                
                {/* Botão Play circular na imagem */}
                <div className="play-button-circle">
                  <Play size={20} fill="currentColor" className="play-icon" />
                </div>
              </div>
              
              {/* Informações do Vídeo */}
              <div className="video-info">
                <div className="video-texts">
                  <h3>{video.titulo}</h3>
                  <p>{video.detalhes}</p>
                </div>
                <ChevronRight size={20} className="video-chevron" />
              </div>
            </Link>
          ))}

          {/* Estado Vazio (se a busca não encontrar nada) */}
          {videosFiltrados.length === 0 && (
            <div className="empty-state">
              <p>Nenhum exercício encontrado para "{busca}".</p>
            </div>
          )}
        </div>

      </section>

      {/* Barra de Navegação Inferior configurada para "Vídeos" */}
      <MenuBar activePage="videos" />

    </main>
  );
}
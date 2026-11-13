import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ChevronLeft, Heart, Info } from 'lucide-react';
import MenuBar from '../../components/menu-bar/menuBar';
import './exercicioVideo.css';

export default function ExercicioVideo() {
  // Num cenário real, usaria o ID para buscar os dados do vídeo na API
  const { id } = useParams(); 
  
  const [favorito, setFavorito] = useState(false);

  // Dados estáticos baseados no design
  const detalhesVideo = {
    titulo: 'Alongamento para começar o dia',
    info: '12 min • Nível leve • Prof. Ana',
    // O ID do vídeo do youtube vai aqui (exemplo fictício)
    youtubeId: 'XZIjrd0TtJ8?si=poeihmGIH5WcW1Cf', 
    aviso: 'Pare se sentir dor, tontura ou falta de ar.'
  };

  return (
    <main className="app-container exercicio-container">
      
      {/* Cabeçalho */}
      <header className="exercicio-header">
        <Link to="/videos" className="back-link">
          <ChevronLeft size={20} />
          <span>Vídeos</span>
        </Link>
        <h1 className="exercicio-title">EXERCÍCIO</h1>
      </header>

      {/* Conteúdo Rolável */}
      <section className="exercicio-content">
        
        {/* Contentor do Iframe (Proporção 16:9) */}
        <div className="video-iframe-wrapper">
          <iframe 
            src={`https://www.youtube.com/embed/${detalhesVideo.youtubeId}?rel=0&modestbranding=1`} 
            title={detalhesVideo.titulo}
            frameBorder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowFullScreen
            className="youtube-iframe"
          ></iframe>
        </div>

        {/* Detalhes do Vídeo */}
        <div className="video-info-section">
          <div className="video-text-group">
            <h2>{detalhesVideo.titulo}</h2>
            <p>{detalhesVideo.info}</p>
          </div>
          
          {/* Botão de Favorito (Coração) */}
          <button 
            className={`favorite-btn ${favorito ? 'active' : ''}`}
            onClick={() => setFavorito(!favorito)}
            aria-label="Adicionar aos favoritos"
          >
            <Heart 
              size={24} 
              fill={favorito ? "#FF6B35" : "none"} 
              color={favorito ? "#FF6B35" : "#FF9B7D"} 
              strokeWidth={2.5}
            />
          </button>
        </div>

        {/* Caixa de Aviso Médico */}
        <div className="warning-banner">
          <div className="warning-icon-wrapper">
            <Info size={20} />
          </div>
          <p>{detalhesVideo.aviso}</p>
        </div>

      </section>

      {/* Barra de Navegação Inferior */}
      <MenuBar activePage="videos" />

    </main>
  );
}
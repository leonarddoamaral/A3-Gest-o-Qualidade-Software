import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ChevronLeft, Heart, Info } from 'lucide-react';
import MenuBar from '../../components/menu-bar/menuBar';
import { buscarExercicioPorId } from '../../API/apiExercicio';
import type { DadosListagemExercicio } from '../../types/exercicio';
import './exercicioVideo.css';

export default function ExercicioVideo() {
  const { id } = useParams();

  const [video, setVideo] = useState<DadosListagemExercicio | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [favorito, setFavorito] = useState(false);

  useEffect(() => {
    if (!id) {
      setCarregando(false);
      return;
    }

    buscarExercicioPorId(Number(id))
      .then((dados) => setVideo(dados))
      .catch((error) => {
        console.error('Erro ao buscar exercício:', error);
        alert('Não foi possível carregar o vídeo.');
      })
      .finally(() => setCarregando(false));
  }, [id]);

  if (carregando) {
    return (
      <main className="app-container exercicio-container">
        <p style={{ textAlign: 'center', color: '#64748B', padding: '40px 24px' }}>
          Carregando exercício...
        </p>
      </main>
    );
  }

  if (!video) {
    return (
      <main className="app-container exercicio-container">
        <p style={{ textAlign: 'center', color: '#64748B', padding: '40px 24px' }}>
          Exercício não encontrado.
        </p>
      </main>
    );
  }

  // Garante separador correto ('&' se a url já tiver '?si=...', ou '?' se for só o ID)
  const separador = video.url.includes('?') ? '&' : '?';
  const embedSrc = `https://www.youtube.com/embed/${video.url}${separador}rel=0&modestbranding=1`;

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
            src={embedSrc}
            title={video.titulo}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="youtube-iframe"
          ></iframe>
        </div>

        {/* Detalhes do Vídeo */}
        <div className="video-info-section">
          <div className="video-text-group">
            <h2>{video.titulo}</h2>
            <p>
              {video.descricao} • {video.nivelDificuldade}
            </p>
          </div>

          {/* Botão de Favorito (Coração) */}
          <button
            className={`favorite-btn ${favorito ? 'active' : ''}`}
            onClick={() => setFavorito(!favorito)}
            aria-label="Adicionar aos favoritos"
          >
            <Heart
              size={24}
              fill={favorito ? '#FF6B35' : 'none'}
              color={favorito ? '#FF6B35' : '#FF9B7D'}
              strokeWidth={2.5}
            />
          </button>
        </div>

        {/* Instruções do Exercício */}
        {video.instrucoes && (
          <div style={{ padding: '0 24px 20px 24px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#004A4D', marginBottom: '6px' }}>
              Como realizar
            </h3>
            <p style={{ fontSize: '14px', color: '#475569', lineHeight: 1.5 }}>
              {video.instrucoes}
            </p>
          </div>
        )}

        {/* Caixa de Aviso Médico */}
        <div className="warning-banner">
          <div className="warning-icon-wrapper">
            <Info size={20} />
          </div>
          <p>{video.precaucoes || 'Pare se sentir dor, tontura ou falta de ar.'}</p>
        </div>
      </section>

      {/* Barra de Navegação Inferior */}
      <MenuBar activePage="videos" />
    </main>
  );
}
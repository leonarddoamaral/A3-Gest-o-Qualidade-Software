import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, Star, CheckCircle } from 'lucide-react';
import Button from '../../components/button/button';
import Input from '../../components/input/input';
import MenuBar from '../../components/menu-bar/menuBar';
import { cadastrarAvaliacao } from '../../API/apiAvaliacao';
import './avaliarAula.css';

export default function AvaliarAula() {
  const { idAgendamento } = useParams();
  const navigate = useNavigate();

  const [experiencia, setExperiencia] = useState<number>(5);
  const [dificuldade, setDificuldade] = useState<number>(2);
  const [relatoProblema, setRelatoProblema] = useState('');
  const [enviando, setEnviando] = useState(false);

  const niveisDificuldade = [
    { valor: 1, texto: 'Muito leve' },
    { valor: 2, texto: 'Leve' },
    { valor: 3, texto: 'Moderada' },
    { valor: 4, texto: 'Intensa' },
    { valor: 5, texto: 'Muito intensa' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!idAgendamento) return;

    setEnviando(true);
    try {
      await cadastrarAvaliacao({
        idAgendamento: Number(idAgendamento),
        avaliacaoExperiencia: experiencia,
        avaliacaoDificuldade: dificuldade,
        relatoProblema,
      });

      alert('Avaliação enviada! Obrigado por ajudar a melhorar nossas aulas.');
      navigate('/minhas-aulas');
    } catch (error: any) {
      alert(error.message || 'Não foi possível enviar a avaliação.');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <main className="app-container avaliar-container">
      <header className="avaliar-header">
        <Link to="/minhas-aulas" className="back-link">
          <ChevronLeft size={20} />
          <span>Minhas Aulas</span>
        </Link>
      </header>

      <section className="avaliar-content">
        <form className="avaliar-form" onSubmit={handleSubmit}>
          {/* Bloco 1: Nota da Experiência */}
          <div className="rating-card">
            <h2>Como foi sua experiência na aula?</h2>
            <p>Toque nas estrelas para dar sua nota</p>

            <div className="stars-row">
              {[1, 2, 3, 4, 5].map((nota) => (
                <button
                  key={nota}
                  type="button"
                  className="star-btn"
                  onClick={() => setExperiencia(nota)}
                  aria-label={`Nota ${nota}`}
                >
                  <Star
                    size={38}
                    fill={nota <= experiencia ? '#FF6B35' : 'none'}
                    color={nota <= experiencia ? '#FF6B35' : '#CBD5E1'}
                    strokeWidth={2}
                  />
                </button>
              ))}
            </div>
            <span className="rating-feedback">
              {experiencia === 5 && 'Excelente!'}
              {experiencia === 4 && 'Muito boa!'}
              {experiencia === 3 && 'Boa'}
              {experiencia === 2 && 'Regular'}
              {experiencia === 1 && 'Precisa melhorar'}
            </span>
          </div>

          {/* Bloco 2: Nível de Esforço / Dificuldade */}
          <div className="rating-card">
            <h2>Qual foi o nível de esforço físico?</h2>
            <p>Isso nos ajuda a adaptar os exercícios para você</p>

            <div className="difficulty-pills">
              {niveisDificuldade.map((nivel) => (
                <button
                  key={nivel.valor}
                  type="button"
                  className={`diff-pill ${dificuldade === nivel.valor ? 'active' : ''}`}
                  onClick={() => setDificuldade(nivel.valor)}
                >
                  <span className="diff-num">{nivel.valor}</span>
                  <span className="diff-text">{nivel.texto}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Bloco 3: Input Padrão para Relato/Comentário */}
          <div className="rating-card">
            <Input
              type="text"
              id="relatoProblema"
              text="Sentiu algum desconforto ou quer deixar um comentário?"
              placeholder="Ex: Achei o ritmo ótimo, ou senti cansaço nos joelhos..."
              onChange={(e) => setRelatoProblema(e.target.value)}
            />
          </div>

          <Button
            text={enviando ? 'ENVIANDO...' : 'ENVIAR AVALIAÇÃO'}
            icon={<CheckCircle size={20} />}
            type="submit"
          />
        </form>
      </section>

      <MenuBar activePage="home" />
    </main>
  );
}
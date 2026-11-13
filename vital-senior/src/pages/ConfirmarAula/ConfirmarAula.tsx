import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, 
  Calendar, 
  Clock, 
  Accessibility, 
  CheckCircle 
} from 'lucide-react';
import Button from '../../components/button/button';
import MenuBar from '../../components/menu-bar/menuBar';
import './confirmarAula.css';

export default function ConfirmarAula() {
  const navigate = useNavigate();

  // Dados estáticos baseados no design para simular a resposta da API[cite: 5]
  const detalhesAula = {
    local: 'Parque da Aclimação',
    imagemUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=800',
    nomeAula: 'Alongamento no parque',
    diaSemana: 'Quarta-feira',
    data: '14 de outubro',
    horario: '09:00 às 09:45',
    vagas: 4,
    prof: {
      iniciais: 'AC',
      nome: 'Prof. Ana Costa',
      registro: 'Fisioterapeuta - CREFITO ativo'
    },
    acessibilidade: 'Ponto de encontro acessível e com bancos.'
  };

  const handleConfirmar = () => {
    // Aqui entrará a lógica de POST para a API confirmando o agendamento
    console.log('Agendamento confirmado!');
    // Redireciona de volta para a Agenda ou exibe um modal de sucesso
    navigate('/agenda');
  };

  return (
    <main className="app-container confirmar-container">
      
      {/* Cabeçalho */}
      <header className="confirmar-header">
        <Link to="/agendar-aula" className="back-link">
          <ChevronLeft size={20} />
          <span>Mapa</span>
        </Link>
      </header>

      {/* Conteúdo Principal (Rolável) */}
      <section className="confirmar-content">
        
        {/* Banner do Local Selecionado[cite: 5] */}
        <div 
          className="hero-banner" 
          style={{ backgroundImage: `url(${detalhesAula.imagemUrl})` }}
        >
          <div className="hero-overlay"></div>
          <span className="hero-badge">LOCAL SELECIONADO</span>
          <h2 className="hero-title">{detalhesAula.local}</h2>
        </div>

        {/* Cartão de Detalhes da Aula[cite: 5] */}
        <div className="details-card">
          <h3 className="class-title">{detalhesAula.nomeAula}</h3>
          
          <div className="detail-row">
            <Calendar size={22} className="detail-icon" />
            <div className="detail-texts">
              <span className="detail-label">{detalhesAula.diaSemana}</span>
              <span className="detail-value">{detalhesAula.data}</span>
            </div>
          </div>

          <div className="detail-row">
            <Clock size={22} className="detail-icon" />
            <div className="detail-texts">
              <span className="detail-label">Horário escolhido</span>
              <span className="detail-value">{detalhesAula.horario}</span>
            </div>
            <span className="spots-badge">{detalhesAula.vagas} vagas</span>
          </div>
        </div>

        {/* Cartão do Profissional[cite: 5] */}
        <div className="prof-card">
          <div className="prof-avatar">
            {detalhesAula.prof.iniciais}
          </div>
          <div className="prof-info">
            <h4>{detalhesAula.prof.nome}</h4>
            <p>{detalhesAula.prof.registro}</p>
          </div>
        </div>

        {/* Cartão de Acessibilidade[cite: 5] */}
        <div className="accessibility-card">
          <Accessibility size={24} className="acc-icon" />
          <p>{detalhesAula.acessibilidade}</p>
        </div>

        {/* Botão de Confirmação[cite: 5] */}
        <div className="confirm-btn-wrapper" onClick={handleConfirmar}>
          <Button 
            text="CONFIRMAR AGENDAMENTO" 
            icon={<CheckCircle size={20} />} 
            type="button" 
          />
        </div>

      </section>

      {/* Barra de Navegação Inferior[cite: 5] */}
      <MenuBar activePage="agenda" />

    </main>
  );
}
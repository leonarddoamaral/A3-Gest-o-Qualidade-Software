import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ChevronLeft, 
  CalendarCheck, 
  Clock, 
  MapPin, 
  ChevronRight,
  XCircle
} from 'lucide-react';
import MenuBar from '../../components/menu-bar/menuBar';
import './minhasAulas.css';

export default function MinhasAulas() {
  const [abaAtiva, setAbaAtiva] = useState<'proximas' | 'historico'>('proximas');

  // Mock de dados simulando o retorno da sua API do Spring Boot
  const agendamentos = {
    proximas: [
      {
        id: 101,
        titulo: 'Alongamento no parque',
        data: 'Qua, 14 de Outubro',
        horario: '09:00',
        local: 'Parque da Aclimação',
        status: 'Confirmada',
        corStatus: 'sucesso' // Verde
      },
      {
        id: 102,
        titulo: 'Fortalecimento',
        data: 'Sex, 16 de Outubro',
        horario: '10:30',
        local: 'Online ao vivo',
        status: 'Confirmada',
        corStatus: 'sucesso'
      }
    ],
    historico: [
      {
        id: 99,
        titulo: 'Equilíbrio e postura',
        data: 'Seg, 12 de Outubro',
        horario: '11:00',
        local: 'Praça das Flores',
        status: 'Concluída',
        corStatus: 'neutro' // Cinzento
      },
      {
        id: 98,
        titulo: 'Caminhada orientada',
        data: 'Sex, 09 de Outubro',
        horario: '16:00',
        local: 'Parque Ibirapuera',
        status: 'Faltou',
        corStatus: 'alerta' // Vermelho/Laranja
      }
    ]
  };

  const listaAtual = abaAtiva === 'proximas' ? agendamentos.proximas : agendamentos.historico;

  return (
    <main className="app-container minhas-aulas-container">
      
      {/* Cabeçalho */}
      <header className="minhas-aulas-header">
        <Link to="/home" className="back-link">
          <ChevronLeft size={20} />
          <span>Início</span>
        </Link>
        <h1 className="minhas-aulas-title">MINHAS AULAS</h1>
      </header>

      {/* Conteúdo Principal */}
      <section className="minhas-aulas-content">
        
        <div className="header-icon-title">
          <div className="title-icon-wrapper">
            <CalendarCheck size={26} strokeWidth={2.5} />
          </div>
          <h2>Seus Agendamentos</h2>
        </div>

        {/* Seletor de Abas (Pílulas) */}
        <div className="tabs-container">
          <button 
            className={`tab-pill ${abaAtiva === 'proximas' ? 'active' : ''}`}
            onClick={() => setAbaAtiva('proximas')}
          >
            Próximas
          </button>
          <button 
            className={`tab-pill ${abaAtiva === 'historico' ? 'active' : ''}`}
            onClick={() => setAbaAtiva('historico')}
          >
            Histórico
          </button>
        </div>

        {/* Lista de Agendamentos */}
        <div className="agendamentos-list">
          {listaAtual.map((aula) => (
            <div key={aula.id} className="agendamento-card">
              
              {/* Bloco de Data/Hora à esquerda */}
              <div className="date-time-block">
                <span className="date-day">{aula.data.split(' ')[0].replace(',', '')}</span>
                <span className="date-num">{aula.data.split(' ')[1]}</span>
              </div>

              {/* Informações da Aula */}
              <div className="agendamento-info">
                <h3>{aula.titulo}</h3>
                
                <div className="info-row">
                  <Clock size={14} className="info-icon" />
                  <span>{aula.data.split(',')[1]} às {aula.horario}</span>
                </div>
                
                <div className="info-row">
                  <MapPin size={14} className="info-icon" />
                  <span>{aula.local}</span>
                </div>

                <div className="agendamento-footer">
                  <span className={`status-badge badge-${aula.corStatus}`}>
                    {aula.status}
                  </span>
                  
                  {/* Se for uma aula futura, pode mostrar um ícone para cancelar ou ver detalhes */}
                  {abaAtiva === 'proximas' ? (
                     <button className="cancel-btn" aria-label="Cancelar agendamento">
                       <XCircle size={20} />
                     </button>
                  ) : (
                    <ChevronRight size={20} className="history-chevron" />
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Estado Vazio */}
          {listaAtual.length === 0 && (
            <div className="empty-state">
              <p>Não tens nenhuma aula {abaAtiva === 'proximas' ? 'agendada' : 'no histórico'}.</p>
              {abaAtiva === 'proximas' && (
                <Link to="/agenda" className="empty-state-link">
                  Ver agenda de aulas
                </Link>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Barra de Navegação Inferior (pode manter ativa no Home ou criar um novo state) */}
      <MenuBar activePage="home" />

    </main>
  );
}
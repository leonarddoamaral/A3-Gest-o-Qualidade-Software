import  { useState } from 'react';
import { HeartPulse, Calendar as CalendarIcon, MapPin, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../../components/button/button';
import MenuBar from '../../components/menu-bar/menuBar';
import './Agenda.css'


export default function Agenda() {
  // Estado para simular o dia selecionado (para futura interatividade)
  const [diaAtivo, setDiaAtivo] = useState('14');

  // Dados estáticos baseados no design do Figma
  const diasSemana = [
    { sigla: 'SEG', data: '12' },
    { sigla: 'TER', data: '13' },
    { sigla: 'HOJE', data: '14' },
    { sigla: 'QUI', data: '15' },
    { sigla: 'SEX', data: '16' },
  ];

  const aulasHoje = [
    {
      horario: '09:00',
      titulo: 'Alongamento suave',
      local: 'Praça das Flores - Prof. Ana',
      badge: 'Confirmada',
      tipoBadge: 'sucesso' // Verde
    },
    {
      horario: '11:00',
      titulo: 'Equilíbrio e postura',
      local: 'Online ao vivo - Prof. Carlos',
      badge: 'Entrar na aula',
      tipoBadge: 'acao' // Laranja
    },
    {
      horario: '16:00',
      titulo: 'Caminhada orientada',
      local: 'Parque da Aclimação - Prof. J...',
      badge: '3 vagas',
      tipoBadge: 'vagas' // Verde
    }
  ];

  return (
    <main className="app-container agenda-container">
       
       {/* Cabeçalho da Agenda */}
       <header className="agenda-header">
          <div className="agenda-title-wrapper">
             <div className="agenda-icon">
                <HeartPulse size={26} strokeWidth={2.5} />
             </div>
             <h1 className="agenda-title">AULAS DE HOJE</h1>
          </div>
       </header>

       {/* Conteúdo Principal */}
       <section className="agenda-content">
          
          {/* Seletor de Dias da Semana */}
          <div className="week-selector">
             {diasSemana.map((dia, index) => (
               <div 
                 key={index} 
                 className={`day-card ${diaAtivo === dia.data ? 'active' : ''}`}
                 onClick={() => setDiaAtivo(dia.data)}
               >
                 <span className="day-str">{dia.sigla}</span>
                 <span className="day-num">{dia.data}</span>
               </div>
             ))}
          </div>

          {/* Data Atual por extenso */}
          <div className="current-date-label">
             <CalendarIcon size={20} />
             <span>Quarta-feira, 14 de outubro</span>
          </div>

          {/* Lista de Aulas */}
          <div className="class-list">
             {aulasHoje.map((aula, index) => (
               <Link to="/confirmar-aula" key={index} className="class-card-link">
                <div className="class-card">
                   <div className="time-block">
                      <Clock size={16} />
                      <span>{aula.horario}</span>
                   </div>
                   
                   <div className="class-info">
                      <h3>{aula.titulo}</h3>
                      <p>{aula.local}</p>
                      
                         <span className={`class-badge badge-${aula.tipoBadge}`}>
                            {aula.badge}
                         </span>
                   </div>
                </div>
               </Link>
             ))}
          </div>

          {/* Botão de Ação Fixo */}
          <div className="book-button-wrapper">
             <Button 
               text="AGENDAR AULA PRESENCIAL" 
               icon={<MapPin size={20} />} 
               type="button" 
               link="/agendar-aula"
             />
          </div>

       </section>

       {/* Barra de Navegação Inferior - Com a prop "agenda" ativa */}
       <MenuBar activePage="agenda" />
       
    </main>
  );
}
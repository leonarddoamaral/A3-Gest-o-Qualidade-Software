import { useState, useEffect, useMemo } from 'react';
import { HeartPulse, Calendar as CalendarIcon, MapPin, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../../components/button/button';
import MenuBar from '../../components/menu-bar/menuBar';
import './Agenda.css';

// --- Funções Auxiliares de Data --- //

// Array para traduzir o dia da semana retornado pelo Date (0 a 6) para a sigla
const diasSemanaNomes = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'];

// Retorna uma string "DiaDaSemana-feira, Dia de Mês"
const formatarDataExtensa = (data: Date) => {
   const opcoesDia = { weekday: 'long' } as const;
   const opcoesMes = { day: 'numeric', month: 'long' } as const;

   // "quarta-feira"
   let diaSemana = data.toLocaleDateString('pt-BR', opcoesDia);
   diaSemana = diaSemana.charAt(0).toUpperCase() + diaSemana.slice(1);

   // "14 de outubro"
   const diaMes = data.toLocaleDateString('pt-BR', opcoesMes);

   return `${diaSemana}, ${diaMes}`;
};

export default function Agenda() {

   // Memoiza os dias gerados para não recalcular a cada clique num separador
   const { diasSemana, diaAtualStr } = useMemo(() => {
      const hoje = new Date();
      const dataDeHojeStr = hoje.toISOString().split('T')[0]; // ex: "2026-11-13"

      const diasGerados = [];

      // Gerar 5 dias: 2 antes de hoje, Hoje, e 2 depois de hoje
      for (let i = -2; i <= 2; i++) {
         const dataIteracao = new Date();
         dataIteracao.setDate(hoje.getDate() + i);

         const sigla = i === 0 ? 'HOJE' : diasSemanaNomes[dataIteracao.getDay()];

         diasGerados.push({
            sigla: sigla,
            // Guardamos o número do dia (ex: '14')
            data: dataIteracao.getDate().toString(),
            // Guardamos a data completa para referência interna (Y-M-D)
            dataCompletaISO: dataIteracao.toISOString().split('T')[0],
            // Objeto date para poder formatar o texto longo depois
            objData: dataIteracao
         });
      }

      return {
         diasSemana: diasGerados,
         diaAtualStr: dataDeHojeStr
      };
   }, []);

   // O estado agora guarda a data ISO inteira (ex: "2026-11-13") para evitar conflitos (ex: dia 14 deste mês e dia 14 do próximo)
   const [diaAtivoISO, setDiaAtivoISO] = useState(diaAtualStr);

   // Encontra o objeto do dia selecionado para mostrar o texto extenso corretamente
   const diaSelecionado = diasSemana.find(d => d.dataCompletaISO === diaAtivoISO);
   const dataExtensa = diaSelecionado ? formatarDataExtensa(diaSelecionado.objData) : '';

   // Dados estáticos das aulas
   const aulasHoje = [
      {
         horario: '09:00',
         titulo: 'Alongamento suave',
         local: 'Praça das Flores - Prof. Ana',
         badge: 'Confirmada',
         tipoBadge: 'sucesso'
      },
      {
         horario: '11:00',
         titulo: 'Equilíbrio e postura',
         local: 'Online ao vivo - Prof. Carlos',
         badge: 'Entrar na aula',
         tipoBadge: 'acao'
      },
      {
         horario: '16:00',
         titulo: 'Caminhada orientada',
         local: 'Parque da Aclimação - Prof. J...',
         badge: '3 vagas',
         tipoBadge: 'vagas'
      }
   ];

   return (
      <>
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
                        className={`day-card ${diaAtivoISO === dia.dataCompletaISO ? 'active' : ''}`}
                        onClick={() => setDiaAtivoISO(dia.dataCompletaISO)}
                     >
                        <span className="day-str">{dia.sigla}</span>
                        <span className="day-num">{dia.data}</span>
                     </div>
                  ))}
               </div>
               {/* Data Atual por extenso */}
               <div className="current-date-label">
                  <CalendarIcon size={20} />
                  <span>{dataExtensa}</span>
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
      </>
   );
}
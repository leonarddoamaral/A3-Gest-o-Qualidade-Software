import { useState, useEffect, useMemo } from 'react';
import { HeartPulse, Calendar as CalendarIcon, MapPin, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../../components/button/button';
import MenuBar from '../../components/menu-bar/menuBar';
import { listarAulas } from '../../API/apiAula';
import { listarAgendamentosPorAluno } from '../../API/apiAgendamento';
import type { DadosListagemAula } from '../../types/aula';
import './Agenda.css';

// --- Funções Auxiliares de Data --- //
const diasSemanaNomes = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'];

const formatarDataExtensa = (data: Date) => {
  const opcoesDia = { weekday: 'long' } as const;
  const opcoesMes = { day: 'numeric', month: 'long' } as const;

  let diaSemana = data.toLocaleDateString('pt-BR', opcoesDia);
  diaSemana = diaSemana.charAt(0).toUpperCase() + diaSemana.slice(1);

  const diaMes = data.toLocaleDateString('pt-BR', opcoesMes);

  return `${diaSemana}, ${diaMes}`;
};

// Extrai YYYY-MM-DD respeitando o fuso horário local
const formatarParaISOLocal = (data: Date) => {
  const ano = data.getFullYear();
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  const dia = String(data.getDate()).padStart(2, '0');
  return `${ano}-${mes}-${dia}`;
};

export default function Agenda() {
  const { diasSemana, diaAtualStr } = useMemo(() => {
    const hoje = new Date();
    const dataDeHojeStr = formatarParaISOLocal(hoje);
    const diasGerados = [];

    for (let i = -2; i <= 2; i++) {
      const dataIteracao = new Date();
      dataIteracao.setDate(hoje.getDate() + i);

      const sigla = i === 0 ? 'HOJE' : diasSemanaNomes[dataIteracao.getDay()];

      diasGerados.push({
        sigla,
        data: dataIteracao.getDate().toString(),
        dataCompletaISO: formatarParaISOLocal(dataIteracao),
        objData: dataIteracao,
      });
    }

    return {
      diasSemana: diasGerados,
      diaAtualStr: dataDeHojeStr,
    };
  }, []);

  const [diaAtivoISO, setDiaAtivoISO] = useState(diaAtualStr);
  const [aulas, setAulas] = useState<DadosListagemAula[]>([]);
  const [aulasConfirmadasIds, setAulasConfirmadasIds] = useState<number[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function carregarDados() {
      try {
        const todasAulas = await listarAulas();
        // Mantém apenas aulas ativas (não canceladas)
        setAulas(todasAulas.filter((a) => a.status !== 'CANCELADA'));

        // Verifica em quais aulas o aluno logado já está inscrito
        const userId = localStorage.getItem('userId');
        if (userId) {
          const agendamentos = await listarAgendamentosPorAluno(Number(userId));
          const idsConfirmados = agendamentos
            .filter((ag) => ag.statusAgendamento === 'CONFIRMADO')
            .map((ag) => ag.aula.idAula);
          setAulasConfirmadasIds(idsConfirmados);
        }
      } catch (error) {
        console.error('Erro ao carregar agenda:', error);
      } finally {
        setCarregando(false);
      }
    }

    carregarDados();
  }, []);

  const diaSelecionado = diasSemana.find((d) => d.dataCompletaISO === diaAtivoISO);
  const dataExtensa = diaSelecionado ? formatarDataExtensa(diaSelecionado.objData) : '';

  // Filtra as aulas do banco pelo dia selecionado no carrossel
  const aulasDoDia = aulas
    .filter((aula) => aula.dataHoraInicio.startsWith(diaAtivoISO))
    .sort((a, b) => a.dataHoraInicio.localeCompare(b.dataHoraInicio));

  return (
    <main className="app-container agenda-container">
      {/* Cabeçalho da Agenda */}
      <header className="agenda-header">
        <div className="agenda-title-wrapper">
          <div className="agenda-icon">
            <HeartPulse size={26} strokeWidth={2.5} />
          </div>
          <h1 className="agenda-title">AULAS DA SEMANA</h1>
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

        {/* Lista de Aulas Dinâmica */}
        <div className="class-list">
          {carregando ? (
            <p style={{ textAlign: 'center', color: '#64748B', padding: '20px 0' }}>
              Carregando aulas...
            </p>
          ) : (
            aulasDoDia.map((aula) => {
              const horarioFormatado = new Date(aula.dataHoraInicio).toLocaleTimeString('pt-BR', {
                hour: '2-digit',
                minute: '2-digit',
              });
              const jaConfirmada = aulasConfirmadasIds.includes(aula.idAula);

              return (
                <Link
                  to={`/confirmar-aula/${aula.idAula}`}
                  key={aula.idAula}
                  className="class-card-link"
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <div className="class-card">
                    <div className="time-block">
                      <Clock size={16} />
                      <span>{horarioFormatado}</span>
                    </div>

                    <div className="class-info">
                      <h3>{aula.titulo}</h3>
                      <p>
                        {aula.local?.nome} - Prof. {aula.nomeProfessor}
                      </p>

                      <span className={`class-badge ${jaConfirmada ? 'badge-sucesso' : 'badge-vagas'}`}>
                        {jaConfirmada ? 'Confirmada' : 'Agendar vaga'}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })
          )}

          {!carregando && aulasDoDia.length === 0 && (
            <p style={{ textAlign: 'center', color: '#64748B', padding: '24px 0', fontWeight: 500 }}>
              Nenhuma aula programada para este dia.
            </p>
          )}
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

      {/* Barra de Navegação Inferior */}
      <MenuBar activePage="agenda" />
    </main>
  );
}
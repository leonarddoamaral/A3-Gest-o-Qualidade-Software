import { useEffect, useState } from 'react';
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
import { listarAgendamentosPorAluno, cancelarAgendamento } from '../../API/apiAgendamento';
import type { DadosListagemAgendamento } from '../../types/agendamento';
import './minhasAulas.css';

export default function MinhasAulas() {
  const [abaAtiva, setAbaAtiva] = useState<'proximas' | 'historico'>('proximas');
  const [agendamentos, setAgendamentos] = useState<DadosListagemAgendamento[]>([]);
  const [carregando, setCarregando] = useState(true);

  const carregarAgendamentos = () => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      setCarregando(false);
      return;
    }

    setCarregando(true);
    listarAgendamentosPorAluno(Number(userId))
      .then((dados) => setAgendamentos(dados))
      .catch((error) => console.error('Erro ao buscar agendamentos:', error))
      .finally(() => setCarregando(false));
  };

  useEffect(() => {
    carregarAgendamentos();
  }, []);

  const handleCancelar = async (idAgendamento: number) => {
    if (!window.confirm('Deseja realmente cancelar este agendamento?')) return;

    try {
      await cancelarAgendamento(idAgendamento);
      carregarAgendamentos();
    } catch (error) {
      console.error('Erro ao cancelar:', error);
      alert('Não foi possível cancelar o agendamento.');
    }
  };

  // Separa automaticamente os agendamentos do backend entre Próximas e Histórico
  const agora = new Date();

  const proximas = agendamentos
    .filter(
      (ag) =>
        new Date(ag.aula.dataHoraInicio) >= agora &&
        ag.statusAgendamento === 'CONFIRMADO'
    )
    .sort((a, b) => a.aula.dataHoraInicio.localeCompare(b.aula.dataHoraInicio));

  const historico = agendamentos
    .filter(
      (ag) =>
        new Date(ag.aula.dataHoraInicio) < agora ||
        ag.statusAgendamento !== 'CONFIRMADO'
    )
    .sort((a, b) => b.aula.dataHoraInicio.localeCompare(a.aula.dataHoraInicio));

  const listaAtual = abaAtiva === 'proximas' ? proximas : historico;

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
            Próximas ({proximas.length})
          </button>
          <button
            className={`tab-pill ${abaAtiva === 'historico' ? 'active' : ''}`}
            onClick={() => setAbaAtiva('historico')}
          >
            Histórico ({historico.length})
          </button>
        </div>

        {/* Lista de Agendamentos */}
        <div className="agendamentos-list">
          {carregando ? (
            <p style={{ textAlign: 'center', color: '#64748B', padding: '24px 0' }}>
              Carregando seus agendamentos...
            </p>
          ) : (
            listaAtual.map((ag) => {
              const dataObj = new Date(ag.aula.dataHoraInicio);
              const diaSemana = dataObj
                .toLocaleDateString('pt-BR', { weekday: 'short' })
                .replace('.', '');
              const diaNum = dataObj.getDate();
              const mesExtenso = dataObj.toLocaleDateString('pt-BR', { month: 'long' });
              const horario = dataObj.toLocaleTimeString('pt-BR', {
                hour: '2-digit',
                minute: '2-digit',
              });

              const isCancelado = ag.statusAgendamento === 'CANCELADO';
              const badgeClass = isCancelado
                ? 'badge-alerta'
                : abaAtiva === 'proximas'
                ? 'badge-sucesso'
                : 'badge-neutro';

              return (
                <Link to={`/minhas-aulas/avaliar/${ag.idAgendamento}`}>
                  <div key={ag.idAgendamento} className="agendamento-card">
                    {/* Bloco de Data à esquerda */}
                    <div className="date-time-block">
                      <span className="date-day">{diaSemana}</span>
                      <span className="date-num">{diaNum}</span>
                  </div>

                  {/* Informações da Aula */}
                  <div className="agendamento-info">
                    <h3>{ag.aula.titulo}</h3>

                    <div className="info-row">
                      <Clock size={14} className="info-icon" />
                      <span>
                        {diaNum} de {mesExtenso} às {horario}
                      </span>
                    </div>

                    <div className="info-row">
                      <MapPin size={14} className="info-icon" />
                      <span>{ag.aula.local?.nome}</span>
                    </div>

                    <div className="agendamento-footer">
                      <span className={`status-badge ${badgeClass}`}>
                        {ag.statusAgendamento}
                      </span>

                      {abaAtiva === 'proximas' ? (
                        <button
                          className="cancel-btn"
                          onClick={() => handleCancelar(ag.idAgendamento)}
                          aria-label="Cancelar agendamento"
                          title="Cancelar agendamento"
                        >
                          <XCircle size={20} />
                        </button>
                      ) : (
                        <ChevronRight size={20} className="history-chevron" />
                      )}
                    </div>
                  </div>
                </div>
                </Link>
              );
            })
          )}

          {/* Estado Vazio */}
          {!carregando && listaAtual.length === 0 && (
            <div className="empty-state">
              <p>
                Você não tem nenhuma aula{' '}
                {abaAtiva === 'proximas' ? 'agendada' : 'no histórico'}.
              </p>
              {abaAtiva === 'proximas' && (
                <Link to="/agendar-aula" className="empty-state-link">
                  Ver aulas próximas
                </Link>
              )}
            </div>
          )}
        </div>
      </section>

      <MenuBar activePage="home" />
    </main>
  );
}
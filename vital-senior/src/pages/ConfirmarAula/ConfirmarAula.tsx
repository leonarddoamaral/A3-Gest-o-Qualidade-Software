import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { 
  ChevronLeft, 
  Calendar, 
  Clock, 
  Accessibility, 
  CheckCircle 
} from 'lucide-react';
import Button from '../../components/button/button';
import MenuBar from '../../components/menu-bar/menuBar';
import { buscarAulaPorId } from '../../API/apiAula';
import { cadastrarAgendamento } from '../../API/apiAgendamento';
import type { DadosListagemAula } from '../../types/aula';
import './confirmarAula.css';

export default function ConfirmarAula() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [aula, setAula] = useState<DadosListagemAula | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    if (!id) {
      setCarregando(false);
      return;
    }

    buscarAulaPorId(Number(id))
      .then((dados) => setAula(dados))
      .catch((error) => {
        console.error('Erro ao buscar aula:', error);
        alert('Não foi possível carregar os detalhes da aula.');
      })
      .finally(() => setCarregando(false));
  }, [id]);

  const handleConfirmar = async () => {
    if (enviando || !aula) return;

    const userId = localStorage.getItem('userId');
    if (!userId) {
      alert('Sessão expirada. Faça login novamente para agendar.');
      navigate('/login');
      return;
    }

    setEnviando(true);
    try {
      await cadastrarAgendamento({
        idAluno: Number(userId),
        idAula: aula.idAula,
      });

      alert('Agendamento confirmado com sucesso!');
      navigate('/minhas-aulas');
    } catch (error: any) {
      alert(error.message || 'Erro ao confirmar agendamento.');
    } finally {
      setEnviando(false);
    }
  };

  if (carregando) {
    return (
      <main className="app-container confirmar-container">
        <p style={{ textAlign: 'center', color: '#64748B', padding: '40px 24px' }}>
          Carregando detalhes da aula...
        </p>
      </main>
    );
  }

  if (!aula) {
    return (
      <main className="app-container confirmar-container">
        <p style={{ textAlign: 'center', color: '#64748B', padding: '40px 24px' }}>
          Aula não encontrada.
        </p>
      </main>
    );
  }

  // Formatações de data e hora a partir do LocalDateTime do Spring Boot
  const dataInicioObj = new Date(aula.dataHoraInicio);
  const dataFimObj = new Date(aula.dataHoraFinal);

  const diaSemanaRaw = dataInicioObj.toLocaleDateString('pt-BR', { weekday: 'long' });
  const diaSemana = diaSemanaRaw.charAt(0).toUpperCase() + diaSemanaRaw.slice(1);
  const dataFormatada = dataInicioObj.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' });

  const horaInicio = dataInicioObj.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  const horaFim = dataFimObj.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

  const iniciaisProf = aula.nomeProfessor
    ? aula.nomeProfessor
        .split(' ')
        .map((parte) => parte[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : 'PR';

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
        {/* Banner do Local Selecionado */}
        <div
          className="hero-banner"
          style={{
            backgroundImage:
              'url(https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=800)',
          }}
        >
          <div className="hero-overlay"></div>
          <span className="hero-badge">LOCAL SELECIONADO</span>
          <h2 className="hero-title">{aula.local?.nome}</h2>
        </div>

        {/* Cartão de Detalhes da Aula */}
        <div className="details-card">
          <h3 className="class-title">{aula.titulo}</h3>

          <div className="detail-row">
            <Calendar size={22} className="detail-icon" />
            <div className="detail-texts">
              <span className="detail-label">{diaSemana}</span>
              <span className="detail-value">{dataFormatada}</span>
            </div>
          </div>

          <div className="detail-row">
            <Clock size={22} className="detail-icon" />
            <div className="detail-texts">
              <span className="detail-label">Horário escolhido</span>
              <span className="detail-value">
                {horaInicio} às {horaFim}
              </span>
            </div>
            <span className="spots-badge">{aula.status}</span>
          </div>
        </div>

        {/* Cartão do Profissional */}
        <div className="prof-card">
          <div className="prof-avatar">{iniciaisProf}</div>
          <div className="prof-info">
            <h4>Prof. {aula.nomeProfessor}</h4>
            <p>Educador Físico / Fisioterapeuta</p>
          </div>
        </div>

        {/* Cartão de Acessibilidade */}
        <div className="accessibility-card">
          <Accessibility size={24} className="acc-icon" />
          <p>{aula.local?.descricao || aula.local?.logradouro}</p>
        </div>

        {/* Botão de Confirmação */}
        <div className="confirm-btn-wrapper" onClick={handleConfirmar}>
          <Button
            text={enviando ? 'CONFIRMANDO...' : 'CONFIRMAR AGENDAMENTO'}
            icon={<CheckCircle size={20} />}
            type="button"
          />
        </div>
      </section>

      {/* Barra de Navegação Inferior */}
      <MenuBar activePage="agenda" />
    </main>
  );
}
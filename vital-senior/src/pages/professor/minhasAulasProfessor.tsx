import  { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, PlusCircle, Calendar, Clock, MapPin, Ban } from 'lucide-react';
import Button from '../../components/button/button';
import MenuBar from '../../components/menu-bar/menuBar';
import { listarAulas, cancelarAula } from '../../API/apiAula';
import { buscarUsuarioPorId } from '../../API/apiUsuario';
import type { DadosListagemAula } from '../../types/aula';
import './professor.css';

export default function MinhasAulasProfessor() {
  const [aulas, setAulas] = useState<DadosListagemAula[]>([]);
  const [carregando, setCarregando] = useState(true);

  const carregarTurmas = async () => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      setCarregando(false);
      return;
    }

    setCarregando(true);
    try {
      const [professor, todasAulas] = await Promise.all([
        buscarUsuarioPorId(Number(userId)),
        listarAulas(),
      ]);

      // Filtra as aulas criadas pelo professor logado
      const minhas = todasAulas.filter(
        (a) => a.nomeProfessor?.toLowerCase() === professor.nome?.toLowerCase()
      );
      setAulas(minhas.sort((a, b) => b.dataHoraInicio.localeCompare(a.dataHoraInicio)));
    } catch (error) {
      console.error('Erro ao carregar aulas do professor:', error);
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregarTurmas();
  }, []);

  const handleCancelarAula = async (idAula: number) => {
    const motivo = window.prompt('Informe o motivo do cancelamento para avisar os alunos:');
    if (!motivo || !motivo.trim()) return;

    try {
      await cancelarAula(idAula, motivo.trim());
      alert('Aula cancelada com sucesso.');
      carregarTurmas();
    } catch {
      alert('Erro ao cancelar a aula.');
    }
  };

  return (
    <main className="app-container prof-container">
      <header className="prof-header">
        <Link to="/home" className="back-link">
          <ChevronLeft size={20} />
          <span>Início</span>
        </Link>
        <h1 className="prof-title">ÁREA DO PROFESSOR</h1>
      </header>

      <section className="prof-content">
        <div className="prof-top-action">
          <div>
            <h2>Minhas Turmas</h2>
            <p>Gerencie suas aulas presenciais publicadas</p>
          </div>

          <Button
            text="NOVA AULA PRESENCIAL"
            icon={<PlusCircle size={20} />}
            type="button"
            link="/professor/cadastrar-aula"
          />
        </div>

        <div className="prof-aulas-list">
          {carregando ? (
            <p style={{ textAlign: 'center', color: '#64748B', padding: '24px 0' }}>
              Carregando suas turmas...
            </p>
          ) : (
            aulas.map((aula) => {
              const dataObj = new Date(aula.dataHoraInicio);
              const dataFimObj = new Date(aula.dataHoraFinal);
              const dataStr = dataObj.toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: 'long',
              });
              const horaStr = `${dataObj.toLocaleTimeString('pt-BR', {
                hour: '2-digit',
                minute: '2-digit',
              })} às ${dataFimObj.toLocaleTimeString('pt-BR', {
                hour: '2-digit',
                minute: '2-digit',
              })}`;

              const cancelada = aula.status === 'CANCELADA';

              return (
                <div key={aula.idAula} className="prof-aula-card">
                  <div className="prof-card-top">
                    <h3>{aula.titulo}</h3>
                    <span className={`prof-badge ${cancelada ? 'badge-cancelada' : 'badge-ativa'}`}>
                      {aula.status}
                    </span>
                  </div>

                  <div className="prof-info-row">
                    <Calendar size={15} />
                    <span>{dataStr}</span>
                  </div>

                  <div className="prof-info-row">
                    <Clock size={15} />
                    <span>{horaStr}</span>
                  </div>

                  <div className="prof-info-row">
                    <MapPin size={15} />
                    <span>{aula.local?.nome}</span>
                  </div>

                  {!cancelada && (
                    <div className="prof-card-actions">
                      <button
                        type="button"
                        className="prof-cancel-btn"
                        onClick={() => handleCancelarAula(aula.idAula)}
                      >
                        <Ban size={16} />
                        <span>Cancelar Aula</span>
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          )}

          {!carregando && aulas.length === 0 && (
            <div className="empty-state">
              <p>Você ainda não publicou nenhuma aula presencial.</p>
            </div>
          )}
        </div>
      </section>

      <MenuBar activePage="agenda" />
    </main>
  );
}
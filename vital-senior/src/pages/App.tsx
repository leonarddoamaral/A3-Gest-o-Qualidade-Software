import Button from '../components/button/button'
import InfoCard from '../components/info-card/infoCard'
import './App.css'

function App() {
  return (
    <>
      <main className="app-container">
    
    <header className="hero-section">
      <div className="hero-overlay"></div>
      

      <div className="top-bar">
        <div className="logo-wrapper">
  
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" className="icon-white">
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
            <path d="M3.22 12H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27"/>
          </svg>
        </div>
        <span className="app-name">Vital Senior</span>
      </div>

      <div className="hero-text">
        <p className="subtitle">MOVIMENTO É VIDA</p>
        <h1 className="main-title">Exercícios seguros,no seu ritmo.</h1>
      </div>
    </header>

    <section className="content-section">
      <div className="content-top">
        <p className="description">
          Aulas presenciais e exercícios gravados para cuidar da sua saúde com confiança.
        </p>
        <InfoCard text="Atividades orientadas por profissionais." />
      </div>
      <Button text="ENTRAR" icon={null} link="/login" />
      
    </section>
    </main>
    </>
  )
}

export default App

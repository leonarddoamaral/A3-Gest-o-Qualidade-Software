import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import Login from './login/login.tsx'
import CadastroUsuario from './cadastro/cadastroUsuario.tsx'
import Home from './home/home.tsx'
import Agenda from './agenda/Agenda.tsx'
import AgendarAula from './agendar-aula/agendarAula.tsx'
import ConfirmarAula from './ConfirmarAula/ConfirmarAula.tsx'
import Videos from './videos/videos.tsx'
import ExercicioVideo from './exercicioVideo/ExercicioVideo.tsx'
import FichaSaude from './Fichasaude/ficha.tsx'
import MinhasAulas from './minhasAulas/minhasAulas.tsx'

function NotFound() {
  return (
    <main style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>Página não encontrada</h1>
      <p>O caminho acessado ainda não foi cadastrado.</p>
      <a href="/">Voltar para o início</a>
    </main>
  )
}

const router = createBrowserRouter([
  {path: '/', element: <App />},
  {path: '/login', element: <Login />},
  {path: '/cadastro', element: <CadastroUsuario />},
  {path: '/home', element: <Home />},
  {path: '/agenda', element: <Agenda />},
  {path: '/agendar-aula', element: <AgendarAula />},
  {path: '/confirmar-aula', element: <ConfirmarAula />},
  {path: '/videos', element: <Videos />},
  {path: '/video/:id', element: <ExercicioVideo /> }, 
  {path: '/minhas-aulas', element: <MinhasAulas />},
  {path: '/cadastro/ficha-saude', element: <FichaSaude />},
    // Rota para exibir vídeo específico
  {path: '*', element: <NotFound />},
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)

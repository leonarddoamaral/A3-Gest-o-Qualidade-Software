import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import Login from './login/login.tsx'
import CadastroUsuario from './cadastro/cadastroUsuario.tsx'

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
  {path: '*', element: <NotFound />},
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)

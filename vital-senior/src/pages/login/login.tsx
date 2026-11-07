
import { Link } from 'react-router';
import Button from '../../components/button/button';
import './login.css';
import Input from '../../components/input/input';

 function Login() {
  return (
    <>
    <main className="app-container">
      
      {/* Cabeçalho interno simplificado */}
      <header className="login-header">
        <Link to="/">
        <button className="back-button" aria-label="Voltar">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="m15 18-6-6 6-6" />
            <path d="M9 12h12" />
          </svg>
        </button>
        </Link>

        <span className="app-name-dark">Vital Senior</span>
      </header>

      <section className="login-content">
        <div className="login-headings">
          <h1 className="login-title">Bem-vindo de volta</h1>
          <p className="login-subtitle">
            Insira seus dados de acesso para continuar cuidando da sua saúde.
          </p>
        </div>
        
        {/* Formulário pronto para integração com o backend */}
        <form className="login-form" onSubmit={(e) => e.preventDefault()}>
          
          <Input type="text" id="email" placeholder="Digite seu e-mail" text="E-mail ou CPF" />
          <Input type="password" id="password" placeholder="Digite sua senha" text="Senha" />
    

          <Link to="/esqueci-senha" className="forgot-password">
            Esqueci minha senha
          </Link>
          
          <Button text="ENTRAR" icon={null} link="/dashboard" />
        </form>
        
        <p className="register-prompt">
          Ainda não tem uma conta? <Link to="/cadastro">Cadastre-se</Link>
        </p>
      </section>
      
    </main>
    </>
  );
}export default Login;
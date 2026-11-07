
import Button from '../../components/button/button';
import { Link } from 'react-router-dom';
import './cadastroUsuario.css';
import Input from '../../components/input/input';


function CadastroUsuario() {
  return (
    <main className="app-container">
      
      {/* Cabeçalho de Navegação */}
      <header className="cadastro-header">
        <Link to="/login" className="back-button" aria-label="Voltar">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="m15 18-6-6 6-6" />
            <path d="M9 12h12" />
          </svg>
        </Link>
        <span className="app-name-dark">Vital Senior</span>
      </header>

      <section className="cadastro-content">
        <div className="cadastro-headings">
          <h1 className="cadastro-title">Crie sua conta</h1>
          <p className="cadastro-subtitle">
            Preencha seus dados para começar a cuidar da sua saúde conosco.
          </p>
        </div>
        
        {/* Formulário mapeado para o DTO do Spring Boot */}
        <form className="cadastro-form" onSubmit={(e) => e.preventDefault()}>
        
        <Input type="text" id="nome" placeholder="Digite seu nome completo" text="Nome Completo" />
        <Input type="email" id="email" placeholder="Digite seu melhor e-mail" text="E-mail" />
        <Input type="tel" id="telefone" placeholder="(00) 00000-0000" text="Telefone" />
        <Input type="date" id="dataNascimento" placeholder="" text="Data de Nascimento" />
        <Input type="password" id="senhaHash" placeholder="Crie uma senha segura" text="Senha" />


          <div className="input-group">
            <label htmlFor="tipoPerfil">Tipo de Perfil</label>
            <select id="tipoPerfil" name="tipoPerfil" required defaultValue="">
              <option value="" disabled>Selecione seu perfil...</option>
              <option value="ALUNO">Sênior / Aluno</option>
              <option value="FAMILIAR">Familiar Responsável</option>
              <option value="PROFISSIONAL">Profissional de Saúde</option>
            </select>
          </div>
          
          <div className="button-wrapper">
            <Button text="CADASTRAR" icon={null} link="/dashboard" />
          </div>
        </form>
        
        <p className="login-prompt">
          Já tem uma conta? <Link to="/login">Entrar</Link>
        </p>
      </section>
      
    </main>
  );
}export default CadastroUsuario;
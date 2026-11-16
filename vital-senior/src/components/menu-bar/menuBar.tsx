
import { Link } from "react-router-dom";
import { Home as HomeIcon, Calendar, PlaySquare } from "lucide-react";
import './menuBar.css';

function MenuBar(props: { activePage: string }) {
    return(
        <>
        {/* Barra de Navegação Inferior */}
      <nav className="bottom-nav">
        <Link to="/home" className={`nav-item ${props.activePage === 'home' ? 'active' : ''}`}>
          <HomeIcon size={22} />
          <span>Início</span>
        </Link>
        <Link to="/agenda" className={`nav-item ${props.activePage === 'agenda' ? 'active' : ''}`}>
          <Calendar size={22} />
          <span>Agenda</span>
        </Link>
        <Link to="/videos" className={`nav-item ${props.activePage === 'videos' ? 'active' : ''}`}>
          <PlaySquare size={22} />
          <span>Vídeos</span>
        </Link>
      </nav>
      </>
    )
}export default MenuBar;
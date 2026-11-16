
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import './action-card.css'

function ActionCard(props:{ title: string, description: string, icon: React.ReactNode, link: string, cor: string}) {
    return(
        <Link to={props.link} className="action-card">
            <div className={`action-icon ${props.cor}`}>
              {props.icon}
            </div>
            <div className="action-texts">
              <h3>{props.title}</h3>
              <p>{props.description}</p>
            </div>
            <ChevronRight size={20} className="action-chevron" />
          </Link>
    )
}export default ActionCard;
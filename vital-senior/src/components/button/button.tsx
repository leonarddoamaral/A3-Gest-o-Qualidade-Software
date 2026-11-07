import { Link } from 'react-router-dom';
import './button.css'

function Button(props: { text: string ;icon?: React.ReactNode ;link: string }) {
  return (
    <Link to={props.link}>
    <button className="btn-primary">
      {props.icon}
        {props.text}
      </button>
      </Link>
  )
}

export default Button
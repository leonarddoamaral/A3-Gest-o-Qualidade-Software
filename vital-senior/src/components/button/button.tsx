import { Link } from 'react-router-dom';
import './button.css'

function Button(props: { text: string; icon?: React.ReactNode; link?: string; type?: "button" | "submit" | "reset" }) {
  // Criamos o botão como um elemento base
  const buttonElement = (
    <button className="btn-primary" type={props.type || "button"}>
      {props.icon}
      {props.text}
    </button>
  );

  // Se o botão receber um link, ele envolve o botão na tag <Link>
  if (props.link) {
    return <Link to={props.link}>{buttonElement}</Link>;
  }

  // Se não tiver link (como nos formulários), devolve só o botão
  return buttonElement;
}

export default Button;
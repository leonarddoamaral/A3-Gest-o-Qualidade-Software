import './input.css'

function Input(props: { type: string; id: string; placeholder: string; text: string }) {
    return (
        <div className="input-group">
            <label htmlFor={props.id}>{props.text}</label>
            <input 
              type={props.type}
              id={props.id}
              placeholder={props.placeholder}
              required
            />
          </div>
    )
}

export default Input
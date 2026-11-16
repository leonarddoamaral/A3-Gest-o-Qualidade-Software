import './input.css'

function Input(props: { type: string; id: string; placeholder: string; text: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }) {
    return (
        <div className="input-group">
            <label htmlFor={props.id}>{props.text}</label>
            <input 
              type={props.type}
              id={props.id}
              placeholder={props.placeholder}
              required
              onChange={props.onChange}
            />
          </div>
    )
}

export default Input
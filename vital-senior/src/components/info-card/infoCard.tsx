import './infoCard.css'

function InfoCard(props: { text: string }) {
  return (
    <div className="info-card">
          <div className="info-bar"></div>
          <p className="info-text">
            {props.text}
          </p>
        </div>
  )
}

export default InfoCard

const Card = ({ item }) => {
  return (
    <div className="container__card">
      <a className="card">
        <h2>{item.data.lastName}</h2>
        <span><strong>Alias: </strong>{item.data.nickname}</span>
        <span><strong>Fecha y Hora intervención: </strong>{item.data.interventionDate}</span>
        <span><strong>Delito: </strong>{item.data.crime}</span>
        <span><strong>Modalidad: </strong>{item.data.modality}</span>
        <br />
        <div className="images-container">
          {item.uploadedImages && item.uploadedImages.length > 0 && item.uploadedImages.map(image => (
            <img key={image.src} src={image.src} className="uploaded-image" />
          ))}
        </div>
      </a>
      <style jsx>
        {`
          .container__card{

          }
          .card{
            display: flex;
            flex-direction: column;
            border: 2px solid gray;
            border-radius: 10px;
            margin: 10px 0;
            padding: 10px;
            width: 100%;
            flex-grow: 1;
          }
          .card span {
            font-size: 15px;
            margin-bottom: 5px
          }
        `}
      </style>
    </div>
  )
}

export default Card

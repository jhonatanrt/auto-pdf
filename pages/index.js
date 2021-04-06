import Head from 'next/head'
import { useState } from 'react'
import * as Helpers from '../utils/helpers'
import HomeStyle from '../styles/Home.module.css'
import CardComponent from '../component/Card'

const formData = {
  lastName: '',
  documentNumber: '',
  nickname: '',
  organization: '',
  crime: '',
  modality: '',
  interventionDate: '',
  place: '',
  character: '',
  signals: '',
}

export default function Home({ articles }) {
  const [uploadedImages, setUploadedImages] = useState([])
  const [userList, setUserList] = useState([])
  const [title, setTitle] = useState('')
  const [data, setData] = useState(formData)

  const handleInputChange = (event) => {
    setData({
      ...data,
      [event.target.name]: event.target.value
    })
  }

  const cleanData = () => {
    setUploadedImages([]);
    setData(formData)
  }

  const cleanUpUploadedImages = () => {
    cleanData();
    setUserList([]);
    uploadedImages.forEach((image) => {
      URL.revokeObjectURL(image.src);
    });
  }

  const generatePdfFromImages = () => {
    Helpers.generatePdfFromImages(userList)
    cleanUpUploadedImages()
  }

  const addPerson = () => {
    setUserList([
      ...userList || {},
      { uploadedImages, data, title }
    ])
    cleanData()
  }

  const handleImageUpload = async (event) => {
    const fileList = event.target.files;
    const fileArray = fileList ? Array.from(fileList) : [];
    const fileToImagePromises = fileArray.map(Helpers.fileToImageURL);

    const result = await Promise.all(fileToImagePromises)
    setUploadedImages(result)
  }

  return (
    <div>
      <Head>
        <title>auto PDF | Dash</title>
        <meta name="keywords" content="web develpment" />
      </Head>
      <div className="container">
        <h2 className="title">Demo Album</h2>
        <div className="file__content input__border">
          <span className="form__subtitle">Título</span>
          <input type="text" placeholder="Complete los datos" name="title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
        </div>
        <div className="form__group">
          <span className="form__subtitle">Apellidos y Nombres</span>
          <input type="text" placeholder="Complete los datos" name="lastName"
            value={data.lastName}
            onChange={handleInputChange}
          />
        </div>
        <div className="form__group">
          <span className="form__subtitle">DNI</span>
          <input type="text" placeholder="Complete los datos" name="documentNumber"
            value={data.documentNumber}
            onChange={handleInputChange}
          />
        </div>
        <div className="form__group">
          <span className="form__subtitle">Alias</span>
          <input type="text" placeholder="Complete los datos" name="nickname"
            value={data.nickname}
            onChange={handleInputChange}
          />
        </div>
        <div className="form__group">
          <span className="form__subtitle">Banda</span>
          <input type="text" placeholder="Complete los datos" name="organization"
            value={data.organization}
            onChange={handleInputChange}
          />
        </div>
        <div className="form__group">
          <span className="form__subtitle">Delito</span>
          <input type="text" placeholder="Complete los datos" name="crime"
            value={data.crime}
            onChange={handleInputChange}
          />
        </div>
        <div className="form__group">
          <span className="form__subtitle">Modalidad</span>
          <input type="text" placeholder="Complete los datos" name="modality"
            value={data.modality}
            onChange={handleInputChange}
          />
        </div>
        <div className="form__group">
          <span className="form__subtitle">Fecha y Hora de intervención</span>
          <input type="date" placeholder="Complete los datos" name="interventionDate"
            value={data.interventionDate}
            onChange={handleInputChange}
          />
        </div>
        <div className="form__group">
          <span className="form__subtitle">Lugar de los hechos</span>
          <input type="text" placeholder="Complete los datos" name="place"
            value={data.place}
            onChange={handleInputChange}
          />
        </div>
        <div className="file__content">
          <span className="form__subtitle">Características físicas</span>
          <input type="text" placeholder="Complete los datos" name="character"
            value={data.character}
            onChange={handleInputChange}
          />
        </div>
        <div className="file__content">
          <span className="form__subtitle">Señales particulares</span>
          <input type="text" placeholder="Complete los datos" name="signals"
            value={data.signals}
            onChange={handleInputChange}
          />
        </div>
        <div className="file__content input__border">
          <label htmlFor="file-input">
            <span className="button form__subtitle">Cargar Imagenes</span>
            <input
              id="file-input"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              // style={{ display: "none" }}
              multiple
            />
          </label>
        </div>


        <button
          onClick={addPerson}
          className="button"
          disabled={uploadedImages.length === 0}
        >
          Agregar
        </button>

        <button
          onClick={generatePdfFromImages}
          className="button"
          disabled={userList.length === 0}
        >
          Generate PDF
        </button>

        {userList.length > 0 && (
          <div className="content__list">
            {userList.map((user, index) => (
              <CardComponent key={index} item={user} />
            ))}
          </div>
        )}

      </div>
      <style jsx>
        {`
          .form__subtitle{
            font-weight: 600;
            text-transform: uppercase;
          }
          .content__list {
            height: 50vh;
            overflow-y: auto;
            width: 90%; 
          }
          .container {
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
          }
          input, button{
            margin: 5px 0;
            padding: 10px;
            width: 100%;
          }
          button {
            width: 100%;
            // margin: 5px;
            margin-right: 10%;
          }
          .title {
            width: 100%;
          }
          .file__content{
            width: 100%;
            padding: 5px;
            margin-right: 10%;
          }
          .input__border{
            margin-bottom: 10px;
            padding-bottom: 20px;
            border-bottom: 1px solid gray;
          }
          .form__group{
            width: 45%;
            justify-content: center;
            display: flex;
            flex-direction: column;
            padding: 5px;
          }

          @media (max-width: 1150px) {
            .form__group, .title, .content__list, .file__content, button {
              width: 100%;
              margin-right: 0;
            }
          }
        `}
      </style>
    </div>
  )
}

// export const getStaticProps = async () => {
//   const response = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=6')
//   const articles = await response.json()

//   return {
//     props: {
//       articles
//     }
//   }
// }

import Head from 'next/head'
import { useState } from 'react'
import * as Helpers from '../utils/helpers'
import HomeStyle from '../styles/Home.module.css'
import CardComponent from '../component/Card'

export default function Home({ articles }) {
  const [uploadedImages, setUploadedImages] = useState([])
  const [userList, setUserList] = useState([])
  const [data, setData] = useState({
    lastName: '',
    nickname: '',
    interventionDate: '',
    crime: '',
    modality: '',
  })

  const handleInputChange = (event) => {
    setData({
      ...data,
      [event.target.name]: event.target.value
    })
  }

  const cleanData = () => {
    setUploadedImages([]);
    setData({
      lastName: '',
      nickname: '',
      interventionDate: '',
      crime: '',
      modality: '',
    })
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
      { uploadedImages, data }
    ])
    cleanData()
    // Helpers.generatePdfFromImages({ uploadedImages, data })
    // cleanUpUploadedImages()
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
        <h2>Demo Album</h2>
        <div className="form__group">
          <span className="form__subtitle">Apellidos y Nombres</span>
          <input type="text" placeholder="Complete los datos" name="lastName"
            value={data.lastName}
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
          <span className="form__subtitle">Fecha y Hora de intervención</span>
          <input type="date" placeholder="Complete los datos" name="interventionDate"
            value={data.interventionDate}
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
          }
          .container {
            display: flex;
            flex-direction: column;
          }
          input, button{
            margin: 10px 0;
            padding: 10px;
            width: 100%;
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

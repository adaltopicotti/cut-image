import { Slider } from '@mui/material'
import html2canvas from 'html2canvas'
import Head from 'next/head'
import Image from 'next/image'
import { ChangeEvent, useEffect, useState } from 'react'
import styles from '../styles/Home.module.css'
import { fileDownloader } from '../utils/FileDownloader'

import jsPDF from 'jspdf'

export default function Home() {
const [url, setUrl] = useState('')
const [selectedFile, setSelectedFile] = useState<File | undefined>()
const [isEditing, setIsEditing] = useState(false)
const [sliderHeight, setSliderHeight] = useState(0)
const [positionY, setPositionY] = useState(32)

const [preview, setPreview] = useState<String | undefined>()


    // create a preview as a side effect, whenever selected file is changed
    useEffect(() => {
        if (!selectedFile) {
            setPreview(undefined)
            return
        }

        const objectUrl = URL.createObjectURL(selectedFile)
        setPreview(objectUrl)
       
        // free memory when ever this component is unmounted
        return () => URL.revokeObjectURL(objectUrl)
    }, [selectedFile])


    const imageScrollHeight = () =>{
      const image = document.querySelector('#image-box')
      console.log('height', image?.scrollHeight)
    }
  
  

const handleOnChangeFile = (event: ChangeEvent<HTMLInputElement>) => {
  console.log({target: event.target})

  if (!event.target.files || event.target.files.length === 0) {
    setSelectedFile(undefined)
    return
}

// I've kept this example simple by using the first image instead of multiple
  setSelectedFile(event.target.files[0])
  setUrl(event.target.baseURI)
}

const unlockEdit = () => {
  const image = document.querySelector('#image-box')
  console.log('height', image?.scrollHeight)
  setSliderHeight(image?.scrollHeight ?? 0)
  setIsEditing(true)
}


const printPage = async () => {

  const html = document.querySelector('#image-box')
  if (html) {
    const data = await html2canvas(html as HTMLElement)
    const img = data.toDataURL('image/png')
    fileDownloader(img, `pagina.png`)
  }
}

const savePdf = async () => {
  const html = document.querySelector('#image-box')
  const pdf = new jsPDF()
  if (html) {
    const data = await html2canvas(html as HTMLElement)
    const img = data.toDataURL('image/png')
   // fileDownloader(img, `pagina.png`)

    const imgProperties = pdf.getImageProperties(img)
   // const pdfHeight = pdf.internal.pageSize.getHeight()
    //const pdfHeight = pdf.internal.pageSize.getHeight() * 0.75
    
    const pdfWidth = (pdf.internal.pageSize.getWidth()) 
    alert(pdfWidth)
     const pdfHeight = (imgProperties.height * pdfWidth) / imgProperties.width
    pdf.addImage(img, 'PNG', 0, 0, pdfWidth, pdfHeight)
    pdf.save('comprovante.pdf')
  }
  

}

const handleUpdatePosition = (_: any, newValue: number | number[]) => {
  const value = sliderHeight - (32 + (newValue as number))
  console.log(value)
  setPositionY(-value)
}

function valueText(value: number) {
  return `${value}°C`;
}

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Corta imagens" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
      <div className={styles.selectionBox}>
            Selecione a imagem
            <div className={styles.inputBox}>
              <input type="file" onChange={handleOnChangeFile} />
              <button>Carregar</button>
            </div>
          <div className={styles.buttonBox}>
            <button onClick={unlockEdit} disabled={!preview}>Editar</button>
            <button onClick={printPage} disabled={!isEditing}>Salvar</button>

          </div>
          
          </div>
        <div className={styles.editorBox}>
          <div className={styles.imageBox} id="image-box">
            {preview && (
              <img id="image" src={String(preview)} 
              alt="Imagem"
               className={styles.imagePreview}
               style={{
                top:`${positionY}px`
               }}
               />
            )}
            
          </div>
          <div style={{padding: '1rem 0',height: 'auto'}}>
            {
              isEditing && (
              <Slider
            aria-label="Temperature"
            orientation="vertical"
            //getAriaValueText={valueText}
            //valueLabelDisplay="auto"
            defaultValue={sliderHeight}
            onChange={handleUpdatePosition}
            min={0}
            max={sliderHeight}
    
          />
              )
            }
          
          </div>
          
          <div>
          
          </div>

       </div>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by Adalto Picotti Junior
        </a>
      </footer>
    </div>
  )
}

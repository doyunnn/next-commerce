import AutoSizeImage from '@/components/AutoSizeImage'
import Button from '@/components/Button'
import Image from 'next/image'
import React, { useRef, useState } from 'react'

export default function ImageUpload() {
  const inputRef = useRef<HTMLInputElement>(null)
  const [image, setImage] = useState('')

  const handleUploade = () => {
    if (inputRef.current && inputRef.current.files) {
      const fd = new FormData()

      fd.append(
        'image',
        inputRef.current.files[0],
        inputRef.current.files[0]?.name,
      )
      fetch(
        'https://api.imgbb.com/1/upload?expiration=15552000&key=07bc96f596f8b687c9b096ff6702a322',
        { method: 'POST', body: fd },
      )
        .then((res) => res.json())
        .then((data) => {
          console.log(data)

          setImage(data.data.image.url)
        })
        .catch((error) => console.log(error))
    }
  }
  console.log(image)

  return (
    <div>
      <input ref={inputRef} type="file" accept="image/*" />
      <Button onClick={handleUploade}>업로드</Button>
      {image !== '' && <AutoSizeImage src={image} />}
    </div>
  )
}

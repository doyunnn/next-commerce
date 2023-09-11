import AutoSizeImage from '@/components/AutoSizeImage'
import CustomEditor from '@/components/Editor'
import { Input, Slider } from '@mantine/core'
import { EditorState, convertFromRaw, convertToRaw } from 'draft-js'
import { useRouter } from 'next/router'
import React, { useEffect, useRef, useState } from 'react'

export default function CommentEdit() {
  const inputRef = useRef<HTMLInputElement>(null)
  const [images, setImages] = useState<string[]>([])
  const router = useRouter()
  const [rate, setRate] = useState(5)
  const { orderItemId } = router.query
  const [editorState, setEditorState] = useState<EditorState | undefined>(
    undefined,
  )

  useEffect(() => {
    if (orderItemId != null) {
      fetch(`/api/get-comment?orderItemId=${orderItemId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.items?.contents) {
            setEditorState(
              EditorState.createWithContent(
                convertFromRaw(JSON.parse(data.items.contents)),
              ),
            )
            setRate(data.items.rate)
            setImages(data.items.images.split(',') ?? [])
          } else {
            setEditorState(EditorState.createEmpty())
          }
        })
    }
  }, [orderItemId])

  const handleChange = () => {
    if (
      inputRef.current &&
      inputRef.current.files &&
      inputRef.current.files.length > 0
    ) {
      for (let i = 0; i < inputRef.current.files.length; i++) {
        const fd = new FormData()

        fd.append(
          'image',
          inputRef.current.files[i],
          inputRef.current.files[i]?.name,
        )
        fetch(
          'https://api.imgbb.com/1/upload?expiration=15552000&key=07bc96f596f8b687c9b096ff6702a322',
          { method: 'POST', body: fd },
        )
          .then((res) => res.json())
          .then((data) => {
            console.log(data)

            setImages((prev) =>
              Array.from(new Set(prev.concat(data.data.image.url))),
            )
          })
          .catch((error) => console.log(error))
      }
    }
  }

  const handleSave = () => {
    if (editorState && orderItemId != null) {
      fetch('/api/update-comment', {
        method: 'POST',
        body: JSON.stringify({
          orderItemId: Number(orderItemId),
          rate: rate,
          contents: JSON.stringify(
            convertToRaw(editorState.getCurrentContent()),
          ),
          images: images.join(','),
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          alert('저장 성공!!')
          router.back()
        })
    }
  }
  return (
    <div className="space-y-[30px]">
      {' '}
      {editorState != null && (
        <CustomEditor
          editorState={editorState}
          onEditorStateChange={setEditorState}
          onSave={handleSave}
        />
      )}
      <Slider
        defaultValue={5}
        min={1}
        max={5}
        step={1}
        value={rate}
        onChange={setRate}
        marks={[
          { value: 1 },
          { value: 2 },
          { value: 3 },
          { value: 4 },
          { value: 5 },
        ]}
      />
      <Input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleChange}
      />
      <div style={{ display: 'flex' }} className="space-x-[10px]">
        {images &&
          images.length > 0 &&
          images.map((image, idx) => <AutoSizeImage key={idx} src={image} />)}
      </div>
    </div>
  )
}

import CustomEditor from '@/components/Editor'
import { IProduct } from '@/pages/api/get-product'
import { products } from '@prisma/client'
import { EditorState, convertFromRaw, convertToRaw } from 'draft-js'
import { GetServerSideProps, GetServerSidePropsContext } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/router'
import Carousel from 'nuka-carousel'
import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { CATEGORY_MAP } from '@/constants/products'

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const product = await fetch(
    `http://localhost:3000/api/get-product?id=${context.params?.id}`,
  )
    .then((res) => res.json())
    .then((data) => data.items)

  return {
    props: {
      product: { ...product },
      images: [product.image_url, product.image_url],
    },
  }
}

export default function Products(props: {
  product: products
  images: string[]
}) {
  const [index, setIndex] = useState(0)

  const router = useRouter()
  const { id: productId } = router.query

  const [editorState] = useState<EditorState | undefined>(() =>
    props.product?.contents
      ? EditorState.createWithContent(
          convertFromRaw(JSON.parse(props.product.contents)),
        )
      : EditorState.createEmpty(),
  )

  const product = props.product
  const images = props.images

  return (
    <>
      {product != null && images != null && productId != null ? (
        <div className="p-24 flex flex-row gap-x-[30px]">
          <div className="max-w-[300px]">
            <Carousel
              animation="fade"
              // autoplay
              withoutControls
              wrapAround
              speed={10}
              slideIndex={index}
            >
              {images.map((url, idx) => (
                <Image
                  key={`${url}-${idx}`}
                  src={url}
                  alt="image"
                  width={300}
                  height={300}
                  // layout="responsive"
                />
              ))}
            </Carousel>
            <div className="flex space-x-4 mt-2">
              {images.map((url, i) => (
                <div key={`${url}-${i}`} onClick={() => setIndex(i)}>
                  <Image src={url} alt="image" width={80} height={80} />
                </div>
              ))}
            </div>
            <div className="mx-[30px] my-[20px] py-[20px] max-w-[1326px] flex flex-row justify-center border">
              {editorState && (
                <CustomEditor editorState={editorState} readOnly />
              )}
            </div>
          </div>
          <div className="max-w-[300px] flex flex-col space-y-5">
            <h1 className="text-lg text-zinc-400">
              {CATEGORY_MAP[product.category_id - 1]}
            </h1>
            <div className="text-4xl font-semibold">{product.name}</div>
            <div className="text-lg">{product.price}</div>
            <div className="text-sm text-zinc-300">
              등록일 : {format(new Date(product.createdAt), 'yyyy년 M월 d일')}
            </div>
          </div>
        </div>
      ) : (
        <h1>빈 값</h1>
      )}
    </>
  )
}

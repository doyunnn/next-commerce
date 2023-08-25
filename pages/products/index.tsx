import { TAKE } from '@/constants/products'
import { products } from '@prisma/client'
import Image from 'next/image'
import React, { useState, useEffect, useCallback } from 'react'

export default function Products() {
  const [skip, setSkip] = useState(0)
  const [products, setProducts] = useState<products[]>([])

  useEffect(() => {
    fetchProducts().then(setProducts)
  }, [])
  const fetchProducts = async (skip: number = 0) => {
    const data = await fetch(`/api/get-products?skip=${skip}&take=${TAKE}`)
      .then((res) => res.json())
      .then((data) => data.items)

    return data
  }
  const getProducts = useCallback(async () => {
    const next = skip + TAKE
    const newData = await fetchProducts(next)
    const list = products.concat(newData)

    setProducts(list)
    setSkip(next)
  }, [skip, products])
  return (
    <div className="px-36 mt-36 mb-36 flex flex-col items-center justify-center">
      {products && (
        <div className="grid grid-cols-3 gap-5">
          {products.map((item) => (
            <div key={item.id} className=" pb-[10px]">
              <Image
                className="rounded"
                src={item.image_url ?? ''}
                width={300}
                height={300}
                alt={item.name}
                placeholder="blur"
                blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=="
              />
              <div className="flex">
                <span>{item.name}</span>
                <span className="ml-auto">
                  {item.price.toLocaleString('ko-KR')}원
                </span>
              </div>
              <span className="text-zinc-400">
                {item.category_id === 1 && '의류'}
              </span>
            </div>
          ))}
        </div>
      )}
      <button
        className="w-full rounded mt-20 bg-zinc-200 p-4"
        onClick={getProducts}
      >
        더보기
      </button>
    </div>
  )
}

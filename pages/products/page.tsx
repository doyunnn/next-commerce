import { products } from '@prisma/client'
import Image from 'next/image'
import React, { useState, useEffect, useCallback } from 'react'
import { Pagination } from '@mantine/core'

const TAKE = 9
export default function Products() {
  // const [skip, setSkip] = useState(0)
  const [products, setProducts] = useState<products[]>([])
  const [total, setTotal] = useState(0)
  const [activePage, setPage] = useState(1)

  useEffect(() => {
    fetchProductsCount().then(setTotal)
    fetchProducts().then(setProducts)
  }, [])
  useEffect(() => {
    const skip = TAKE * (activePage - 1)
    fetchProducts(skip).then(setProducts)
  }, [activePage])
  const fetchProductsCount = async () => {
    const data = await fetch(`/api/get-products-count`)
      .then((res) => res.json())
      .then((data) => Math.ceil(data.items / TAKE))

    return data
  }
  const fetchProducts = async (skip: number = 0) => {
    const data = await fetch(`/api/get-products?skip=${skip}&take=${TAKE}`)
      .then((res) => res.json())
      .then((data) => data.items)

    return data
  }

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
      <div className="w-full flex mt-5">
        <Pagination
          className="m-auto"
          value={activePage}
          onChange={setPage}
          total={total}
        />
      </div>
    </div>
  )
}

import { categories, products } from '@prisma/client'
import Image from 'next/image'
import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { Pagination, SegmentedControl } from '@mantine/core'
import { CATEGORY_MAP, TAKE } from '@/constants/products'

export default function Products() {
  // const [skip, setSkip] = useState(0)
  const [products, setProducts] = useState<products[]>([])
  const [total, setTotal] = useState(0)
  const [categories, setCategories] = useState<categories[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('-1')
  const [activePage, setPage] = useState(1)

  useEffect(() => {
    fetchCategories().then(setCategories)
  }, [])
  useEffect(() => {
    fetchProductsCount(selectedCategory).then(setTotal)
  }, [selectedCategory])
  useEffect(() => {
    const skip = TAKE * (activePage - 1)
    fetchProducts(skip, selectedCategory).then(setProducts)
  }, [activePage, selectedCategory])
  const fetchCategories = async () => {
    const data = await fetch(`/api/get-categories`)
      .then((res) => res.json())
      .then((data) => data.items)

    return data
  }
  const fetchProductsCount = async (category: string) => {
    const data = await fetch(`/api/get-products-count?category=${category}`)
      .then((res) => res.json())
      .then((data) => Math.ceil(data.items / TAKE))

    return data
  }
  const fetchProducts = async (skip: number = 0, category: string) => {
    const data = await fetch(
      `/api/get-products?skip=${skip}&take=${TAKE}&category=${category}`,
    )
      .then((res) => res.json())
      .then((data) => data.items)

    return data
  }

  const categoriesList = useMemo(() => {
    const list = [{ label: 'ALL', value: '-1' }]
    if (categories && categories.length > 0) {
      for (const c of categories) {
        const data = { label: c.name, value: String(c.id) }
        list.push(data)
      }
    }
    return list
  }, [categories])

  return (
    <div className="px-36 mt-36 mb-36 flex flex-col items-center justify-center">
      <div className="mb-4 ">
        {categoriesList && (
          <SegmentedControl
            value={selectedCategory}
            onChange={setSelectedCategory}
            data={categoriesList}
            color="dark"
          />
        )}
      </div>
      {products && (
        <div className="grid grid-cols-3 gap-5">
          {products.map((item) => (
            <div key={item.id} className="max-w-[310px] pb-[10px]">
              <Image
                className="rounded"
                src={item.image_url ?? ''}
                width={300}
                height={300}
                alt={item.name}
                placeholder="blur"
                blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=="
              />
              <div className="flex mt-[5px]">
                <span>{item.name}</span>
                <span className="ml-auto">
                  {item.price.toLocaleString('ko-KR')}원
                </span>
              </div>
              <span className="text-zinc-400">
                {CATEGORY_MAP[item.category_id - 1]}
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

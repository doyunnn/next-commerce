import { categories, products } from '@prisma/client'
import Image from 'next/image'
import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { Input, Pagination, SegmentedControl, Select } from '@mantine/core'
import { CATEGORY_MAP, FILTERS, OrderByType, TAKE } from '@/constants/products'
import { IconSearch } from '@tabler/icons-react'
import useDebounced from '../../hooks/useDebounce'
import useCacheGetProducts from '../api/hooks/useCacheGetProducts'
import useCacheGetCategories from '../api/hooks/useCacheGetCategories'
import useCacheGetProductsCount from '../api/hooks/useCacheGetProductsCount'

export default function Products() {
  // const [skip, setSkip] = useState(0)
  // const [products, setProducts] = useState<products[]>([])
  // const [total, setTotal] = useState(0)
  // const [categories, setCategories] = useState<categories[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('-1')
  const [activePage, setPage] = useState(1)
  const [selectedFilter, setSelectedFilter] = useState<OrderByType | null>(
    FILTERS[0].value,
  )
  const [keyword, setKeyword] = useState('')

  const debouncedKeyword = useDebounced<string>(keyword)

  const { data: total } = useCacheGetProductsCount(
    selectedCategory,
    debouncedKeyword,
  )
  const { data: categories } = useCacheGetCategories()

  const { data: products } = useCacheGetProducts({
    skip: activePage,
    category: Number(selectedCategory),
    orderBy: selectedFilter,
    contains: debouncedKeyword,
  })

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value)
  }

  // useEffect(() => {
  //   fetchCategories().then(setCategories)
  // }, [])
  // useEffect(() => {
  //   fetchProductsCount(selectedCategory, debouncedKeyword).then(setTotal)
  // }, [selectedCategory, debouncedKeyword])
  // useEffect(() => {
  //   const skip = TAKE * (activePage - 1)
  //   fetchProducts(
  //     skip,
  //     selectedCategory,
  //     selectedFilter,
  //     debouncedKeyword,
  //   ).then(setProducts)
  // }, [activePage, selectedCategory, selectedFilter, debouncedKeyword])
  // const fetchCategories = async () => {
  //   const data = await fetch(`/api/get-categories`)
  //     .then((res) => res.json())
  //     .then((data) => data.items)

  //   return data
  // }
  // const fetchProductsCount = async (category: string, keyword: string) => {
  //   const data = await fetch(
  //     `/api/get-products-count?category=${category}&contains=${keyword}`,
  //   )
  //     .then((res) => res.json())
  //     .then((data) => Math.ceil(data.items / TAKE))

  //   return data
  // }

  return (
    <div className="px-36 mt-36 mb-36 flex flex-col justify-center">
      <div className="mb-[10px]">
        <Input
          icon={<IconSearch />}
          placeholder="Search"
          value={keyword}
          onChange={handleChange}
        />
      </div>
      <div className="mb-[10px]">
        <Select
          value={selectedFilter}
          onChange={(value) => setSelectedFilter(value as OrderByType)}
          data={FILTERS}
        />
      </div>
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
          total={total ?? 0}
        />
      </div>
    </div>
  )
}

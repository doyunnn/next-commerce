import { TAKE } from '@/constants/products'
import React from 'react'
import { useQuery } from 'react-query'

export default function useCacheGetProductsCount(
  category: string,
  keyword: string,
) {
  const fetchProductsCount = async () => {
    const data = await fetch(
      `/api/get-products-count?category=${category}&contains=${keyword}`,
    )
      .then((res) => res.json())
      .then((data) => Math.ceil(data.items / TAKE))

    return data
  }
  const { data } = useQuery<number>(
    ['productCount', category, keyword],
    fetchProductsCount,
  )
  return { data }
}

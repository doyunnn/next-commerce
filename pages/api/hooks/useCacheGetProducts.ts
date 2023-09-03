import React from 'react'
import { useQuery } from 'react-query'
import { IProducts } from '../get-products'
import { TAKE } from '@/constants/products'
import { products } from '@prisma/client'

export default function useCacheGetProducts(props: IProducts) {
  const { skip, category, orderBy, contains } = props
  const fetchProducts = async () => {
    const data = await fetch(
      `/api/get-products?skip=${skip}&take=${TAKE}&category=${category}&orderBy=${orderBy}&contains=${contains}`,
    )
      .then((res) => res.json())
      .then((data) => data.items)

    return data
  }
  const { data } = useQuery<products[], unknown>(
    ['products', skip, category, orderBy, contains],
    fetchProducts,
  )
  return { data }
}

import { categories } from '@prisma/client'
import React from 'react'
import { useQuery } from 'react-query'

export default function useCacheGetCategories() {
  const fetchCategories = async () => {
    const data = await fetch(`/api/get-categories`)
      .then((res) => res.json())
      .then((data) => data.items)

    return data
  }
  const { data } = useQuery<categories[]>(['categories'], fetchCategories)
  return { data }
}

import { TAKE } from '@/constants/products'
import { WishList, products } from '@prisma/client'
import React from 'react'
import { useQuery } from 'react-query'

export const WISHLIST_QUERY_KEY = 'wishlists'
export default function useCacheGetWishlists() {
  const fetchWishList = async () => {
    const data = await fetch(`/api/get-wishlists`)
      .then((res) => res.json())
      .then((data) => data.items)

    return data
  }
  const { data } = useQuery<{ items: products[] }, unknown, products[]>(
    [WISHLIST_QUERY_KEY],
    fetchWishList,
  )
  return { data }
}

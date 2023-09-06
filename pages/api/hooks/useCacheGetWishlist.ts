import { TAKE } from '@/constants/products'
import { WishList } from '@prisma/client'
import React from 'react'
import { useQuery } from 'react-query'

export const WISHLIST_QUERY_KEY = 'wishlist'
export default function useCacheGetWishlist() {
  const fetchWishList = async () => {
    const data = await fetch(`/api/get-wishlist`)
      .then((res) => res.json())
      .then((data) => data.items)

    return data
  }
  const { data } = useQuery(['wishlist'], fetchWishList)
  return { data }
}

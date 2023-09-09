import { ICartItem } from '@/pages/cart'
import { Cart } from '@prisma/client'
import { useQuery } from 'react-query'

export const CART_QUERY_KEY = 'cart'
export default function useCacheGetCart() {
  const fetchCart = async () => {
    const data = await fetch(`/api/get-cart`)
      .then((res) => res.json())
      .then((data) => data.items)

    return data
  }
  const { data } = useQuery<{ items: ICartItem[] }, unknown, ICartItem[]>(
    [CART_QUERY_KEY],
    fetchCart,
  )
  return { data }
}

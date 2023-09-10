import { OrderDetail } from '@/pages/my'
import { OrderItem } from '@prisma/client'
import { useQuery } from 'react-query'

export const ORDER_QUERY_KEY = 'order'
export default function useCacheGetOrder() {
  const fetchCart = async () => {
    const data = await fetch(`/api/get-order`)
      .then((res) => res.json())
      .then((data) => data.items)

    return data
  }
  const { data } = useQuery<{ items: OrderDetail[] }, unknown, OrderDetail[]>(
    [ORDER_QUERY_KEY],
    fetchCart,
  )

  return { data }
}

import type { NextApiRequest, NextApiResponse } from 'next'
import { OrderItem, PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function getComments(productId: number) {
  try {
    // orders 테이블에서 나의 주문들을 조회한다.

    const orderItems = await prisma.orderItem.findMany({
      where: {
        productId: productId,
      },
    })
    let response = []
    // orderItemIds를 기반으로 Comment를 조회한다.
    for (const orderItem of orderItems) {
      const res = await prisma.comment.findUnique({
        where: {
          orderItemId: orderItem.id,
        },
      })
      if (res) {
        response.push({ ...orderItem, ...res })
      }
    }

    return response
  } catch (error) {
    console.error(error)
  }
}

type Data = {
  items?: any
  message: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  const { productId } = req.query
  if (productId == null) {
    res.status(200).json({ items: [], message: 'no productId' })
    return
  }

  try {
    const comments = await getComments(Number(productId))
    res.status(200).json({ items: comments, message: 'Success' })
  } catch (error) {
    res.status(400).json({ message: 'Failed' })
  }
}

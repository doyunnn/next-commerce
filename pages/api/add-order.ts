import type { NextApiRequest, NextApiResponse } from 'next'
import { Cart, OrderItem, PrismaClient } from '@prisma/client'
import { unstable_getServerSession } from 'next-auth'
import { authOptions } from './auth/[...nextauth]'

const prisma = new PrismaClient()

async function addOrder(
  userId: string,
  items: Omit<OrderItem, 'id'>[],
  orderInfo?: { receiver: string; address: string; phoneNumber: string },
) {
  try {
    // orderItem 들을 만든다.
    let orderItemIds = []
    for (const item of items) {
      const orderItem = await prisma.orderItem.create({
        data: {
          ...item,
        },
      })
      orderItemIds.push(orderItem.id)
    }

    console.log(orderItemIds, 'orderItemIds')

    // 만들어진 orderItemIds 를 포함한 order을 만든다.
    const response = await prisma.orders.create({
      data: {
        userId,
        orderItemIds: orderItemIds.join(','),
        ...orderInfo,
        status: 0,
      },
    })

    console.log(response)

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
  const session = await unstable_getServerSession(req, res, authOptions)
  const { items, orderInfo } = JSON.parse(req.body)
  if (session == null) {
    res.status(200).json({ items: [], message: 'no Session' })
    return
  }
  try {
    const cart = await addOrder(String(session.id), items, orderInfo)
    res.status(200).json({ items: cart, message: 'Success' })
  } catch (error) {
    res.status(400).json({ message: 'Failed' })
  }
}

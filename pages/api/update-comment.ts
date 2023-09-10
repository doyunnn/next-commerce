import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'
import { unstable_getServerSession } from 'next-auth'
import { authOptions } from './auth/[...nextauth]'
import { comment } from 'postcss'

const prisma = new PrismaClient()

interface IUpdateComment {
  userId: string
  orderItemId: number
  rate: number
  contents: string
}

async function updateComment(props: IUpdateComment) {
  const { userId, orderItemId, rate, contents } = props
  try {
    const response = await prisma.comment.upsert({
      where: {
        orderItemId,
      },
      update: {
        contents,
        rate,
      },
      create: {
        userId,
        orderItemId,
        contents,
        rate,
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
  const { orderItemId, rate, contents } = JSON.parse(req.body)
  if (session == null) {
    res.status(200).json({ items: [], message: 'no Session' })
    return
  }

  try {
    const newComment: IUpdateComment = {
      userId: String(session.id),
      orderItemId: orderItemId,
      rate: rate,
      contents: contents,
    }
    const comment = await updateComment(newComment)
    res.status(200).json({ items: comment, message: 'Success' })
  } catch (error) {
    res.status(400).json({ message: 'Failed' })
  }
}

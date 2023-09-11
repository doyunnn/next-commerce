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
  images: string
}

async function updateComment(props: IUpdateComment) {
  const { userId, orderItemId, rate, contents, images } = props
  try {
    const response = await prisma.comment.upsert({
      where: {
        orderItemId,
      },
      update: {
        contents,
        rate,
        images,
      },
      create: {
        userId,
        orderItemId,
        contents,
        rate,
        images,
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
  const { orderItemId, rate, contents, images } = JSON.parse(req.body)
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
      images: images,
    }
    const comment = await updateComment(newComment)
    res.status(200).json({ items: comment, message: 'Success' })
  } catch (error) {
    res.status(400).json({ message: 'Failed' })
  }
}

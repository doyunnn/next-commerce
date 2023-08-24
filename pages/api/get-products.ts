import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function getProducs(skip: number, take: number) {
  try {
    const response = await prisma.products.findMany({
      skip: skip,
      take: take,
    })
    console.log(response)
    return response
  } catch (error) {
    console.log(error)
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
  const { skip, take } = req.query
  if (skip == null || take == null) {
    res.status(400).json({ message: 'no skip or take' })
    return
  }
  try {
    const response = await getProducs(Number(skip), Number(take))
    res.status(200).json({ items: response, message: `Success get producs` })
  } catch (error) {
    return res.status(400).json({ message: `Failed get producs` })
  }
}
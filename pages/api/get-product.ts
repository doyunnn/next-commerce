import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function getProduct(id: number) {
  try {
    const response = await prisma.products.findUnique({
      where: {
        id: id,
      },
    })
    console.log(response)
    return response
  } catch (error) {
    console.log(error)
    console.error(error)
  }
}

type Data = {
  items?: IProduct | null
  message: string
}
export type IProduct = {
  id: number
  name: string
  image_url: string | null
  category_id: number
  contents: string | null
  createdAt: Date
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  const { id } = req.query
  if (id == null) {
    res.status(400).json({ message: 'no id' })
    return
  }
  try {
    const response = await getProduct(Number(id))
    res.status(200).json({ items: response, message: `Success get id product` })
  } catch (error) {
    return res.status(400).json({ message: `Failed get id product` })
  }
}

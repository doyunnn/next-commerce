import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function getProducsCount(category: number, contains: string) {
  const containsCondition =
    contains && contains !== '' ? { name: { contains: contains } } : undefined
  const where =
    category && category !== -1
      ? {
          category_id: category,
          ...containsCondition,
        }
      : containsCondition
      ? containsCondition
      : undefined
  try {
    const response = await prisma.products.count({ where: where })
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
  const { category, contains } = req.query
  try {
    const response = await getProducsCount(Number(category), String(contains))
    res.status(200).json({ items: response, message: `Success get producs` })
  } catch (error) {
    return res.status(400).json({ message: `Failed get producs` })
  }
}

import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function getCategories() {
  try {
    const response = await prisma.categories.findMany({})
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
  try {
    const response = await getCategories()
    res.status(200).json({ items: response, message: `Success get producs` })
  } catch (error) {
    return res.status(400).json({ message: `Failed get producs` })
  }
}

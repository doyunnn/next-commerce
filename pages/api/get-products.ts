import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'
import { OrderByType, getOrderBy } from '@/constants/products'

const prisma = new PrismaClient()

export interface IProducts {
  skip: number
  take?: number
  category?: number
  orderBy?: OrderByType | null
  contains?: string
}

async function getProducs(props: IProducts) {
  const { skip, take, category, orderBy, contains } = props
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
  const orderByCondition = getOrderBy(orderBy)
  try {
    const response = await prisma.products.findMany({
      skip: skip,
      take: take,
      where: where,
      ...orderByCondition,
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
  const { skip, take, category, orderBy, contains } = req.query
  if (skip == null || take == null) {
    res.status(400).json({ message: 'no skip or take' })
    return
  }

  const params: IProducts = {
    skip: Number(skip),
    take: Number(take),
    category: Number(category),
    orderBy: orderBy as OrderByType,
    contains: String(contains),
  }
  try {
    const response = await getProducs(params)
    res.status(200).json({ items: response, message: `Success get producs` })
  } catch (error) {
    return res.status(400).json({ message: `Failed get producs` })
  }
}

import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'
import jwtDecode from 'jwt-decode'

const prisma = new PrismaClient()

async function SignUp(credential: string) {
  const decoded: {
    name: string
    email: string
    pricture: string
  } = jwtDecode(credential)
  try {
    const response = await prisma.user.upsert({
      where: {
        email: decoded.email,
      },
      update: {
        name: decoded.name,
        image: decoded.pricture,
      },
      create: {
        email: decoded.email,
        name: decoded.name,
        image: decoded.pricture,
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
  items?: any
  message: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  const { credential } = req.query
  try {
    const response = await SignUp(String(credential))
    res.status(200).json({ items: response, message: `Success sign in` })
  } catch (error) {
    return res.status(400).json({ message: `Failed sign in` })
  }
}

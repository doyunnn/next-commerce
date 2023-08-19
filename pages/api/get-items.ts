import type { NextApiRequest, NextApiResponse } from 'next'
import { Client } from '@notionhq/client'

const notion = new Client({
  auth: 'secret_VsQ1ObqKmtH6g0thI0iZOE1w1yiHXIy0LFRbYmQ08KR',
})

const databaseId = 'ff3cd9c8b94a4d2e96d52c446929202b'

async function getItems() {
  try {
    const response = await notion.databases.query({
      database_id: databaseId,
      //   sorts: [
      //     {
      //       property: '가격',
      //       direction: 'ascending',
      //     },
      //   ],
    })
    console.log(response)
    return response
  } catch (error) {
    console.log(error)

    console.error(JSON.stringify(error))
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
    const response = await getItems()
    res
      .status(200)
      .json({ items: response?.results, message: `Success get items` })
  } catch (error) {
    return res.status(400).json({ message: `Failed get items` })
  }
}

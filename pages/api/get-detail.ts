import type { NextApiRequest, NextApiResponse } from 'next'
import { Client, collectPaginatedAPI } from '@notionhq/client'

const notion = new Client({
  auth: 'secret_VsQ1ObqKmtH6g0thI0iZOE1w1yiHXIy0LFRbYmQ08KR',
})

const databaseId = 'ff3cd9c8b94a4d2e96d52c446929202b'

async function getDetail(pageId: string, propertyId: string) {
  try {
    const response = await notion.pages.properties.retrieve({
      page_id: pageId,
      property_id: propertyId,
    })
    console.log(response)
    return response
  } catch (error) {
    console.log(error)

    console.error(JSON.stringify(error))
  }
}

type Data = {
  detail?: any
  message: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  try {
    const { pageId, propertyId } = req.query
    const response = await getDetail(String(pageId), String(propertyId))
    res.status(200).json({ detail: response, message: `Success get detail` })
  } catch (error) {
    return res.status(400).json({ message: `Failed get detail` })
  }
}

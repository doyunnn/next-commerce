export const CATEGORY_MAP = ['Sneakers', 'T-Shirt', 'Pants', 'Cap', 'Hoodie']

export const TAKE = 9

export type OrderByType = 'latest' | 'expensive' | 'cheap'
export const FILTERS: { label: string; value: OrderByType }[] = [
  {
    label: '최신순',
    value: 'latest',
  },
  {
    label: '가격 높은 순',
    value: 'expensive',
  },
  { label: '가격 낮은 순', value: 'cheap' },
]

export const getOrderBy = (orderBy?: OrderByType) => {
  return orderBy
    ? orderBy === 'latest'
      ? { orderBy: { createdAt: 'desc' } }
      : orderBy === 'expensive'
      ? { orderBy: { price: 'desc' } }
      : { orderBy: { createdAt: 'asc' } }
    : undefined
}

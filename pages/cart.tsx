import CountControl from '@/components/CountControl'
import { IconRefresh, IconX } from '@tabler/icons-react'
import Image from 'next/image'
import { useRouter } from 'next/router'
import React, { useState, useEffect, useMemo } from 'react'
import styled from '@emotion/styled'
import { Button } from '@mantine/core'
import useCacheGetProducts from './api/hooks/useCacheGetProducts'
import { CATEGORY_MAP } from '@/constants/products'
import { Cart, OrderItem } from '@prisma/client'
import useCacheGetCart, { CART_QUERY_KEY } from './api/hooks/useCacheGetCart'
import { useMutation, useQueryClient } from 'react-query'
import { ORDER_QUERY_KEY } from './api/hooks/useCacheGetOrder'
import { da } from 'date-fns/locale'

export interface ICartItem extends Cart {
  name: string
  price: number
  image_url: string
}

export default function CartPage() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { data } = useCacheGetCart()

  const deliveryAmount = data && data.length > 0 ? 5000 : 0
  const discountAmount = 0

  const amount = useMemo(() => {
    if (data == null) {
      return 0
    }
    return data.map((item) => item.amount).reduce((pre, curr) => pre + curr, 0)
  }, [data])

  const { data: products } = useCacheGetProducts({
    skip: 0,
    take: 3,
    contains: '',
  })

  const { mutate: addOrder } = useMutation<
    unknown,
    unknown,
    Omit<OrderItem, 'id'>[],
    any
  >(
    (items) =>
      fetch('/api/add-order', {
        method: 'POST',
        body: JSON.stringify({ items }),
      })
        .then((data) => data.json())
        .then((res) => res.items),
    {
      onMutate: () => {
        queryClient.invalidateQueries([ORDER_QUERY_KEY])
      },
      onSuccess: () => {
        router.push('/my')
      },
    },
  )

  const handleOrder = () => {
    if (data == null) {
      return
    }
    addOrder(
      data.map((cart) => ({
        productId: cart.productId,
        price: cart.price,
        amount: cart.amount,
        quantity: cart.quantity,
      })),
    )
    alert(
      `장바구니에 담긴 것들 ${data.map((item) => item.name).join(', ')} 주문`,
    )
  }

  return (
    <div>
      <span className="text-2xl mb-3">Cart ({data ? data.length : 0})</span>
      <div className="flex">
        <div className="flex flex-col p-4 space-y-4 flex-1">
          {data ? (
            data.length > 0 ? (
              data.map((item, idx) => <Item key={idx} {...item} />)
            ) : (
              <div>장바구니에 아무것도 없습니다.</div>
            )
          ) : (
            <div>로딩 중...</div>
          )}
        </div>
        <div className="px-4">
          <div
            className="flex flex-col p-4 space-y-4"
            style={{ minWidth: 300, border: '1px solid grey' }}
          >
            <div>Info</div>
            <Row>
              <span>금액</span>
              <span>{amount.toLocaleString('ko-kr')} 원</span>
            </Row>
            <Row>
              <span>배송비</span>
              <span>{deliveryAmount.toLocaleString('ko-kr')} 원</span>
            </Row>
            <Row>
              <span>할인 금액</span>
              <span>{discountAmount.toLocaleString('ko-kr')} 원</span>
            </Row>
            <Row>
              <span className="font-semibold">결제 금액</span>
              <span className="font-semibold text-red-500">
                {(amount + deliveryAmount - discountAmount).toLocaleString(
                  'ko-kr',
                )}{' '}
                원
              </span>
            </Row>

            <Button
              style={{ backgroundColor: 'black' }}
              radius="xl"
              size="md"
              styles={{
                root: { height: 48 },
              }}
              onClick={handleOrder}
            >
              구매하기
            </Button>
          </div>
        </div>
      </div>
      <div className="mt-32">
        <p>추천상품</p>
        {products && (
          <div className="grid grid-cols-3 gap-5">
            {products.map((item) => (
              <div
                key={item.id}
                style={{ maxWidth: 310 }}
                onClick={() => router.push(`/products/${item.id}`)}
              >
                <Image
                  className="rounded"
                  alt={item.name}
                  src={item.image_url ?? ''}
                  width={310}
                  height={390}
                  placeholder="blur"
                  blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mM0tbSsBwACegEoriWGfgAAAABJRU5ErkJggg=="
                />
                <div className="flex">
                  <span>{item.name}</span>
                  <span className="ml-auto">
                    {item.price.toLocaleString('ko-KR')}원
                  </span>
                </div>
                <span className="text-zinc-400">
                  {CATEGORY_MAP[item.category_id - 1]}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

const Item = (props: ICartItem) => {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [quantity, setQuantity] = useState<number | '' | undefined>(
    props.quantity,
  )
  const [amount, setAmount] = useState<number>(props.quantity)
  useEffect(() => {
    if (quantity != null) {
      setAmount(Number(quantity) * props.price)
    }
  }, [quantity, props.price])

  const { mutate: updateCart } = useMutation<unknown, unknown, ICartItem, any>(
    (item) =>
      fetch('/api/update-cart', {
        method: 'POST',
        body: JSON.stringify({ item }),
      })
        .then((data) => data.json())
        .then((res) => res.items),
    {
      onMutate: async (item) => {
        await queryClient.cancelQueries([CART_QUERY_KEY])

        // Snapshot the previous value
        const previous = queryClient.getQueryData([CART_QUERY_KEY])

        // Optimistically update to the new value
        queryClient.setQueryData<ICartItem[] | undefined>(
          [CART_QUERY_KEY],
          (old) => old?.filter((c) => c.id !== item.id).concat(item),
        )

        // Return a context object with the snapshotted value
        return { previous }
      },
      onError: (error, _, context) => {
        queryClient.setQueryData([CART_QUERY_KEY], context.previous)
      },
      onSuccess: () => {
        queryClient.invalidateQueries([CART_QUERY_KEY])
      },
    },
  )

  const { mutate: deleteCart } = useMutation<unknown, unknown, number, any>(
    (id) =>
      fetch('/api/delete-cart', {
        method: 'POST',
        body: JSON.stringify({ id }),
      })
        .then((data) => data.json())
        .then((res) => res.items),
    {
      onMutate: async (id) => {
        await queryClient.cancelQueries([CART_QUERY_KEY])

        // Snapshot the previous value
        const previous = queryClient.getQueryData([CART_QUERY_KEY])

        // Optimistically update to the new value
        queryClient.setQueryData<ICartItem[] | undefined>(
          [CART_QUERY_KEY],
          (old) => old?.filter((c) => c.id !== id),
        )

        // Return a context object with the snapshotted value
        return { previous }
      },
      onError: (error, _, context) => {
        queryClient.setQueryData([CART_QUERY_KEY], context.previous)
      },
      onSuccess: () => {
        queryClient.invalidateQueries([CART_QUERY_KEY])
      },
    },
  )

  const handleUpdate = () => {
    if (quantity == null) {
      alert('최소 수량을 선택하세요.')
      return
    }
    updateCart({
      ...props,
      quantity: Number(quantity),
      amount: props.price * Number(quantity),
    })
  }

  const handleDelete = async () => {
    await deleteCart(props.id)
    alert(`장바구니에서 ${props.name}이 삭제됐습니다.`)
  }

  return (
    <div className="w-full flex p-4" style={{ borderBottom: '1px solid grey' }}>
      <Image
        src={props.image_url}
        width={155}
        height={195}
        alt={props.name}
        onClick={() => router.push(`/products/${props.productId}`)}
      />
      <div className="flex flex-col ml-4">
        <span className="font-semibold mb-2">{props.name}</span>
        <span className="mb-auto">
          가격: {props.price.toLocaleString('ko-kr')} 원
        </span>
        <div className="flex items-center space-x-4">
          <CountControl value={quantity} setValue={setQuantity} max={20} />
          <IconRefresh onClick={handleUpdate} />
        </div>
      </div>
      <div className="flex ml-auto space-x-4">
        <span>{amount.toLocaleString('ko-kr')} 원</span>
        <IconX onClick={handleDelete} />
      </div>
    </div>
  )
}

const Row = styled.div`
  display: flex;
  * ~ * {
    margin-left: auto;
  }
`

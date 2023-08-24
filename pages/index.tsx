import Image from 'next/image'
import { Inter } from 'next/font/google'
import Button from '@components/Button'
import { useEffect, useRef, useState } from 'react'
import { css } from '@emotion/react'
import Link from 'next/link'

type IDatabase = {
  id: string
  name: string
  createdAt: string
  properties: {
    id: string
  }[]
}

export default function Home() {
  const [products, setProducts] = useState<IDatabase[]>([])
  const inputRef = useRef<HTMLInputElement>(null)

  // useEffect(() => {
  //   fetch('/api/get-items')
  //     .then((res) => res.json())
  //     .then((data) => setProducts(data.items))
  // }, [])
  useEffect(() => {
    fetch('/api/get-products')
      .then((res) => res.json())
      .then((data) => setProducts(data.items))
  }, [])

  const handleClick = () => {
    const inputValue = inputRef.current?.value
    if (inputRef.current == null || inputValue == '') {
      alert('name을 넣어주세요.')
      return
    }
    fetch(`/api/add-item?name=${inputValue}`)
      .then((res) => res.json())
      .then((data) => alert(data.message))
  }

  const getDetail = (pageId: string, propertyId: string) => {
    fetch(`/api/get-detail?pageId=${pageId}&propertyId=${propertyId}`)
      .then((res) => res.json())
      .then((data) => alert(JSON.stringify(data.detail)))
  }
  return (
    <main
      className={`flex  min-h-screen flex-col items-center justify-center gap-y-[50px] p-24 `}
    >
      <div className="grid text-center">
        <input
          className="placeholder:italic placeholder:text-slate-400 w-96 block bg-white  border border-slate-300 rounded-md py-2 px-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm"
          ref={inputRef}
          type="text"
          placeholder="name"
        />
      </div>
      <button
        onClick={handleClick}
        css={css`
          background-color: pink;
          padding: 16px;
          border-radius: 8px;
        `}
      >
        <h2 className={`font-semibold`}>Add Jacket</h2>
      </button>

      <Button onClick={handleClick}>Add Product</Button>

      <div className="">
        <h2 className={`text-2xl font-semibold`}>Prouct List</h2>
        <br />
        {products &&
          products.map((item) => (
            <div key={item.id}>
              <Link href={`/products/${item.id}`}>
                <div className="flex gap-x-[10px]">
                  <p>{item.name}</p>
                  <span>{item.createdAt}</span>
                </div>
              </Link>
            </div>
          ))}
        {/* {products &&
          products.map((item) => (
            <div key={item.id} className="w-full w-auto">
              {JSON.stringify(item)}
              {item.properties &&
                Object.entries(item.properties).map(([key, value]) => (
                  <button
                    key={key}
                    className="p-[5px] mx-[5px] rounded-md bg-slate-500"
                    onClick={() => getDetail(item.id, value.id)}
                  >
                    {key}
                  </button>
                ))}
              <br />
              <br />
            </div>
          ))} */}
      </div>

      {/* ---------------------------------------------- */}
      <br />
      <br />
      <div className="relative flex place-items-center before:absolute before:h-[100px] before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700/10 after:dark:from-sky-900 after:dark:via-[#0141ff]/40 before:lg:h-[360px]">
        <Image
          className="relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert"
          src="/next.svg"
          alt="Next.js Logo"
          width={180}
          height={37}
          priority
        />
      </div>
    </main>
  )
}

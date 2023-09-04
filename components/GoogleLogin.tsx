import { useSession, signIn, signOut } from 'next-auth/react'
import Button from './Button'
export default function GoogleLogin() {
  const { data: session } = useSession()
  if (session) {
    return (
      <>
        Signed in as {session.user?.email} <br />
        <Button onClick={() => signOut()}>Sign out</Button>
      </>
    )
  }
  return (
    <>
      <div className="mb-[10px]">Not signed in</div>
      <Button onClick={() => signIn()}>Sign in</Button>
    </>
  )
}

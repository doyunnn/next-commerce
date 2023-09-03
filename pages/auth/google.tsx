import { CredentialResponse, GoogleLogin } from '@react-oauth/google'

export default function Google() {
  const registerUser = (credentialRes: CredentialResponse) => {
    fetch(`/api/auth/sign-in?credential=${credentialRes.credential}`)
      .then((res) => res.json())
      .then((data) => data)
  }
  return (
    <div className="flex">
      <GoogleLogin
        onSuccess={registerUser}
        onError={() => {
          console.log('Login Failed')
        }}
      />
    </div>
  )
}

import { GOOGLE_CLIENT_ID } from '@/constants/googleAuth'
import {
  CredentialResponse,
  GoogleLogin,
  GoogleOAuthProvider,
} from '@react-oauth/google'

export default function Google() {
  const registerUser = (credentialRes: CredentialResponse) => {
    fetch(`/api/auth/sign-in?credential=${credentialRes.credential}`)
      .then((res) => res.json())
      .then((data) => data)
  }
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <div className="flex">
        <GoogleLogin
          onSuccess={registerUser}
          onError={() => {
            console.log('Login Failed')
          }}
        />
      </div>
    </GoogleOAuthProvider>
  )
}

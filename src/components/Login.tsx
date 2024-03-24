import axios from 'axios'
import CryptoJS from 'crypto-js'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from './ui/button'

export default function Login() {
  const [loginDetails, setLoginDetails] = useState({
    username: '',
    password: '',
  })
  const navigate = useNavigate()
  const secretKey = 'jedaya_secretkey'

  const police_token = localStorage.getItem('class_token')

  useEffect(() => {
    if (police_token) {
      window.location.href = '/'
    }
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    const name = e.target.name

    setLoginDetails((values) => ({ ...values, [name]: value }))
  }

  const [errorInput, setErrorInput] = useState<string>('')

  const encrypt = (encrypt: string) => {
    const ciphertext = CryptoJS.AES.encrypt(encrypt, secretKey).toString()

    localStorage.setItem('chores_token', ciphertext)
  }

  const encryptUser = (encrypt: string) => {
    const ciphertext = CryptoJS.AES.encrypt(encrypt, secretKey).toString()

    localStorage.setItem('chores_', ciphertext)
  }

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!loginDetails.username || !loginDetails.password)
      return setErrorInput('Please fill in all fields')

    console.log(loginDetails.username, loginDetails.password)
    axios
      .get(`${import.meta.env.VITE_CLASS_CHORES}/login.php`, {
        params: loginDetails,
      })
      .then((res) => {
        if (res.data.length > 0) {
          console.log(res.data)
          encrypt(res.data[0].type.toString())

          if (res.data[0].user_id.toString()) {
            encryptUser(res.data[0].user_id.toString())
          }
          localStorage.setItem('chores_reauth', '0')

          if (res.data[0].type === 'admin') {
            navigate('/')
          } else {
            navigate('/student/sched')
          }
        }
      })
      .catch((error) => {
        console.error('Error occurred during login:', error)
      })
  }

  return (
    <div className="w-full h-screen border-2 flex justify-center items-center flex-col text-center">
      <div>
        {/* <img src={Logo} alt="logo" className="w-[20rem]" /> */}

        <form
          onSubmit={handleLogin}
          className="flex flex-col justify-center items-center bg-green-500 text-white p-5 rounded-lg shadow-lg w-[30rem]"
        >
          <div className="flex flex-col items-center justify-center gap-2 mt-5  w-[40rem] p-4 ">
            <input
              onChange={handleChange}
              type="text"
              placeholder="Username"
              name="username"
              className="p-2 border-2 rounded-md outline-none w-[20rem] text-black"
            />
            <input
              onChange={handleChange}
              type="password"
              placeholder="Password"
              name="password"
              className="p-2 border-2 rounded-md outline-none w-[20rem] text-black"
            />
            <span>
              <a href="/register">Create account</a>
            </span>
            <Button
              type="submit"
              className="p-2 bg-white  text-black rounded-md w-[10rem]"
            >
              Login
            </Button>

            {errorInput && (
              <p className="text-primary-red border-2 bg-white p-2 rounded-md font-semibold">
                {errorInput}
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}

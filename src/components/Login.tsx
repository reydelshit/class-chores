import axios from 'axios'
import { Link } from 'react-router-dom'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { useState } from 'react'

export default function Login() {
  const [loginDetails, setLoginDetails] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  // if (!localStorage.getItem('dating_site_id')) {
  //   window.location.href = '/home';
  // }

  const defaultPassword = 'admin'
  const defaultUsername = 'admin'

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    const name = e.target.name

    setLoginDetails((values) => ({ ...values, [name]: value }))

    if (name === 'username') {
      setUsername(value)
    }

    if (name === 'password') {
      setPassword(value)
    }
  }

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (username === defaultUsername || password === defaultPassword) {
      localStorage.setItem('chores', '0')
      localStorage.setItem('chores_type', 'admin')
      window.location.href = '/'
    } else {
      axios
        .get(`${import.meta.env.VITE_CLASS_CHORES}/login.php`, {
          params: loginDetails,
        })
        .then((res) => {
          // console.log('success')
          localStorage.setItem('chores', res.data[0].student_id)
          localStorage.setItem('chores_type', res.data[0].type)

          if (res.data[0].type === 'student') {
            window.location.href = '/student/sched'
          }

          console.log(res.data)
        })
    }
  }

  return (
    <div className="w-full h-screen border-2 flex justify-center items-center flex-col text-center">
      <div>
        {/* <img src={Logo} alt="logo" className="w-[20rem]" /> */}

        <form
          onSubmit={handleLogin}
          className="flex flex-col justify-center items-center bg-green-500 text-white p-5 rounded-lg shadow-lg w-[30rem]"
        >
          <Input
            type="text"
            placeholder="Email"
            className="mb-2 text-white placeholder:text-white"
            name="username"
            onChange={handleChange}
          />
          <Input
            type="password"
            placeholder="Password"
            className="mb-2 text-white placeholder:text-white"
            name="password"
            onChange={handleChange}
          />
          <Button
            className="w-[80%] bg-white text-green-500 hover:bg-white"
            type="submit"
          >
            Login
          </Button>
        </form>
      </div>
    </div>
  )
}

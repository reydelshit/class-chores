import { useState } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import axios from 'axios'
import CryptoJS from 'crypto-js'

interface DataObject {
  [key: string]: number
}

export default function VerifyPassword({
  setShowReauth,
  storeDeleteID,
  phpFile,
  deleteIDColumn,
  decrypt,
}: {
  setShowReauth: (value: boolean) => void
  storeDeleteID: number
  phpFile: string
  deleteIDColumn: string
  decrypt?: () => void
}) {
  const [verifyPassword, setVerifyPassword] = useState<string>('')
  const secretKey = 'jedaya_secretkey'
  const [error, setError] = useState<string>('')

  const deleteTable = async () => {
    if (phpFile.length > 0 && deleteIDColumn.length > 0) {
      const dataObject: DataObject = {}
      dataObject[deleteIDColumn] = storeDeleteID

      await axios
        .delete(`${import.meta.env.VITE_CLASS_CHORES}/${phpFile}.php`, {
          data: dataObject,
        })
        .then((res) => {
          console.log(res.data)
          setShowReauth(false)

          if (localStorage.getItem('chores_reauth') === '0') {
            localStorage.setItem('chores_reauth', '1')
          }

          decrypt && decrypt()
        })
    }
  }

  const handleVerifyPassword = async () => {
    const user_id = localStorage.getItem('chores_') as string

    await axios
      .get(`${import.meta.env.VITE_CLASS_CHORES}/reauth.php`, {
        params: { user_id: user_id, password: verifyPassword },
      })
      .then((res) => {
        console.log(res.data)

        if (res.data.length > 0) {
          deleteTable()
        } else {
          setError('Invalid password')
        }
      })
  }

  return (
    <div className="absolute w-full bg-white bg-opacity-75 h-screen py-[5rem] flex justify-center z-30 top-0">
      <div className="bg-[#125B50] text-white border-2 h-fit mt-[2rem] p-6 rounded-md w-[40%]">
        <div>
          <h1 className="my-2">
            {' '}
            Enter your password again to verify your identity
          </h1>
          <div>
            <Label>Password</Label>
            <Input
              onChange={(e) => setVerifyPassword(e.target.value)}
              name="password"
              className="w-full"
              type="password"
            />
          </div>
        </div>

        {error.length > 0 && <div className="text-red-500">{error}</div>}

        <div className="mt-[2rem]">
          <Button
            className="bg-white  text-black"
            onClick={() => setShowReauth(false)}
          >
            Cancel
          </Button>

          <Button
            className="bg-white ml-2 text-black"
            onClick={handleVerifyPassword}
          >
            Verify
          </Button>
        </div>
      </div>
    </div>
  )
}

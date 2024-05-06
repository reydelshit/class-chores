import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import axios from 'axios'
import moment from 'moment'
import { useEffect, useState } from 'react'
import { Button } from '../ui/button'
import Notification from './Notification'
import { useNavigate } from 'react-router-dom'
import CryptoJS from 'crypto-js'
import { Input } from '../ui/input'
import { Label } from '../ui/label'

type StudentType = {
  studentFirst: string
  studentLast: string
  image: string
  groupAssigned: string
  student_id: number
}

type ScheduleType = {
  allDay: string
  end: string
  start: string
  title: string
  id: number
}
export default function StudentSched() {
  const [studentData, setStudentData] = useState<StudentType[]>([])
  const [studentDataObj, setStudentDataObj] = useState({
    studentFirst: '',
    studentLast: '',
    image: '',
    groupAssigned: '',
    student_id: 0,
  })
  const [showNotification, setShowNotification] = useState(false)
  const [schedule, setSchedule] = useState<ScheduleType[]>([])
  const navigate = useNavigate()

  const user_id = localStorage.getItem('chores_') as string
  const chores_token = localStorage.getItem('chores_token') as string

  const [showSeedPharase, setShowSeedPhrase] = useState(false)
  const [seedPhraseInput, setSeedPhrase] = useState('')
  const seeedPhraseLocal = localStorage.getItem('seed_phrase') as null | string
  const [error, setError] = useState('')
  const [seedPhraseCount, setSeedPhraseCount] = useState(0)
  const [showSeedPhraseDelete, setShowSeedPhraseDelete] = useState(false)

  const handleChangePhrase = (e: React.ChangeEvent<HTMLInputElement>) => {
    // count the compareNumbers, if comma is greater then 5 then return true
    // else return false and set the error message also while counting the comma
    // set the count number to 1, 2 ,3 and so on

    const compareNumbers = seedPhraseInput.split(',').length
    if (compareNumbers > 5) {
      console.log('more than 5')
      setError('You"re good to go!')
    } else {
      setError('More more more!')
    }

    // count the commas
    const count = seedPhraseInput.split(',').length

    setSeedPhraseCount(count)

    setSeedPhrase(e.target.value)

    if (seedPhraseInput.length === 0) {
      setError('')
    }
  }

  const handleSubmitSeedPharase = () => {
    axios
      .post(`${import.meta.env.VITE_CLASS_CHORES}/seed-phrase.php`, {
        user_id: user_id,
        seed_phrase: seedPhraseInput,
      })
      .then((res) => {
        console.log(res.data)
        localStorage.setItem('seed_phrase', '1')
        setShowSeedPhrase(false)
      })
  }

  const fetchStudentData = () => {
    axios
      .get(`${import.meta.env.VITE_CLASS_CHORES}/fetch-student.php`, {
        params: { user_id: user_id },
      })
      .then((res: any) => {
        console.log(res.data)

        axios
          .get(`${import.meta.env.VITE_CLASS_CHORES}/student.php`, {
            params: { student_id: res.data[0].student_id },
          })
          .then((res: any) => {
            setStudentData(res.data[0])
            setStudentDataObj(res.data[0])

            if (res.data[0].groupAssigned) {
              fetchStudentSchedule(res.data[0].groupAssigned)
            }
          })
      })
  }

  const fetchStudentSchedule = (assigned: string) => {
    axios
      .get(`${import.meta.env.VITE_CLASS_CHORES}/fetchschedstudents.php`, {
        params: {
          group_name: assigned,
        },
      })
      .then((res) => {
        console.log(res.data, 's')
        setSchedule(res.data)
      })
  }

  const handleLogout = () => {
    localStorage.removeItem('chores')
    localStorage.removeItem('chores_type')
    localStorage.removeItem('seed_phrase')
    window.location.href = '/login'
  }
  useEffect(() => {
    // if (chores_token !== 'student') {
    //   navigate('/')
    // }

    if (seeedPhraseLocal?.length === 0) {
      setShowSeedPhrase(true)
    }

    fetchStudentData()
  }, [])

  const handleDeleteAccount = () => {
    axios
      .get(`${import.meta.env.VITE_CLASS_CHORES}/seed-phrase.php`, {
        params: { user_id: user_id, seed_phrase: seedPhraseInput },
      })
      .then((res) => {
        if (res.data.length === 0) {
          setError('Seed Phrase is incorrect or no existing seed phrase found!')
          return
        } else {
          axios
            .delete(`${import.meta.env.VITE_CLASS_CHORES}/seed-phrase.php`, {
              data: { user_id: user_id, seed_phrase: seedPhraseInput },
            })
            .then((res) => {
              console.log(res.data, 'dsds')

              if (res.data.status === 'success') {
                localStorage.removeItem('chores_')
                localStorage.removeItem('chores_token')
                localStorage.removeItem('seed_phrase')
                window.location.href = '/login'
              } else {
                setError('Seed Phrase is incorrect')
              }
            })
        }
      })
  }

  const handleShowSeedPhrase = () => {
    setShowSeedPhraseDelete(true)
  }

  return (
    <div className="flex w-full  items-center flex-col h-screen relative">
      {showSeedPharase && (
        <div className="absolute w-full bg-white !text-black bg-opacity-75 h-screen py-[5rem] flex justify-center z-30 top-0">
          <div className="bg-white border-2 h-fit mt-[2rem] p-6 rounded-md w-[40%]">
            <div>
              <h1 className="my-2 font-bold">
                {' '}
                Enter your seed phrase to use when you delete your account
              </h1>

              <span className="my-2 block">
                Example:
                <span className="text-green-500 ml-2">
                  word1, word2, word3, word4, word5, word6
                </span>
              </span>
              <div>
                <Label>Enter your seed phrase, seperated by commas</Label>
                <Input
                  onChange={handleChangePhrase}
                  name="seed_phrase"
                  className="w-full"
                  type="text"
                />
              </div>

              {seedPhraseCount > 0 && (
                <div className="text-green-500 my-4">
                  Seed Phrase Count: {seedPhraseCount}
                </div>
              )}

              {error.length > 0 && (
                <div className="text-white bg-black p-2 rounded-md">
                  {error}
                </div>
              )}
            </div>

            <div className="mt-[2rem]">
              <Button
                className="bg-white  text-black"
                onClick={() => setShowSeedPhrase(false)}
              >
                Cancel
              </Button>

              <Button
                className="bg-white ml-2 text-black"
                onClick={handleSubmitSeedPharase}
              >
                Save
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="flex w-[80%] justify-between h-[4rem] py-[5rem] px-2">
        <div className="flex items-center gap-2">
          {studentDataObj && (
            <>
              <img
                src={studentDataObj.image}
                alt=""
                className="w-[5rem] h-[5rem] rounded-full object-cover"
              />
              <h1 className="text-3xl font-bold">
                Welcome, {studentDataObj.studentFirst}{' '}
                {studentDataObj.studentLast}
              </h1>
            </>
          )}
        </div>

        <div>
          <Button onClick={() => setShowNotification(!showNotification)}>
            Notification
          </Button>
        </div>

        {showNotification && (
          <div className="absolute right-[20rem] border-2 w-[20rem] p-2 top-[8rem] bg-white rounded-md z-50">
            <Notification
              group_id={parseInt(studentDataObj.groupAssigned.split(' ')[1])}
            />
          </div>
        )}
      </div>

      <div className="w-[80%] mt-[5rem]">
        <h1 className="my-4 text-2xl font-bold bg-green-500 text-white w-fit p-2 rounded-lg">
          {studentDataObj.groupAssigned} Assigned Chores
        </h1>
        <Table className="border-2">
          <TableHeader className="bg-green-500">
            <TableRow>
              <TableHead className="text-white">Title</TableHead>
              <TableHead className="text-white">Start</TableHead>
              <TableHead className="text-white">End</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {schedule.length > 0 &&
              schedule.map((sched, index) => (
                <TableRow key={index}>
                  <TableCell>{sched.title}</TableCell>
                  <TableCell>{moment(sched.start).format('lll')}</TableCell>
                  <TableCell>{moment(sched.end).format('lll')}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>

      <div>
        <div className="fixed bottom-10 left-5 flex w-full justify-between px-[5rem]">
          <Button onClick={handleLogout}>Logout</Button>

          <Button onClick={handleShowSeedPhrase}>Delete Account</Button>
        </div>
      </div>

      {showSeedPhraseDelete && (
        <div className="absolute w-full bg-white !text-black bg-opacity-75 h-screen py-[5rem] flex justify-center z-30 top-0">
          <div className="bg-white border-2 h-fit mt-[2rem] p-6 rounded-md w-[40%]">
            <div>
              <h1 className="my-2 font-bold">
                {' '}
                Enter your seed phrase to delete your account
              </h1>

              <span className="my-2 block">
                Example:
                <span className="text-green-500 ml-2">
                  word1, word2, word3, word4, word5, word6
                </span>
              </span>
              <div>
                <Label>Enter your seed phrase, seperated by commas</Label>
                <Input
                  onChange={handleChangePhrase}
                  name="seed_phrase"
                  className="w-full"
                  type="text"
                />
              </div>

              {seedPhraseCount > 0 && (
                <div className="text-green-500 my-4">
                  Seed Phrase Count: {seedPhraseCount}
                </div>
              )}

              {error.length > 0 && (
                <div className="text-white bg-black p-2 rounded-md">
                  {error}
                </div>
              )}
            </div>

            <div className="mt-[2rem]">
              <Button
                className="bg-white  text-black"
                onClick={() => setShowSeedPhraseDelete(false)}
              >
                Cancel
              </Button>

              <Button
                className="bg-white ml-2 text-black"
                onClick={handleDeleteAccount}
              >
                DELETE NOW
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

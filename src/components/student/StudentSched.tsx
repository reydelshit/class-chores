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
  const secretKey = 'jedaya_secretkey'

  const fetchStudentData = () => {
    const user_id = localStorage.getItem('chores_') as string

    const bytes = CryptoJS.AES.decrypt(user_id.toString(), secretKey)
    const plaintext = bytes.toString(CryptoJS.enc.Utf8)

    axios
      .get(`${import.meta.env.VITE_CLASS_CHORES}/student.php`, {
        params: { student_id: plaintext },
      })
      .then((res: any) => {
        console.log(res.data)
        setStudentData(res.data[0])
        setStudentDataObj(res.data[0])

        if (res.data[0].groupAssigned) {
          axios
            .get(
              `${import.meta.env.VITE_CLASS_CHORES}/fetchschedstudents.php`,
              {
                params: {
                  group_name: res.data[0].groupAssigned,
                },
              },
            )
            .then((res) => {
              console.log(res.data, 's')
              setSchedule(res.data)
            })
        }
      })
  }

  const handleLogout = () => {
    localStorage.removeItem('chores')
    localStorage.removeItem('chores_type')
    window.location.href = '/login'
  }
  useEffect(() => {
    fetchStudentData()
  }, [])
  return (
    <div className="flex w-full  items-center flex-col h-screen">
      <div className="flex w-[80%] justify-between h-[4rem] py-[5rem] px-2">
        <div className="flex items-center gap-2">
          <img
            src={studentDataObj.image}
            alt=""
            className="w-[5rem] h-[5rem] rounded-full object-cover"
          />
          <h1 className="text-3xl font-bold">
            Welcome, {studentDataObj.studentFirst} {studentDataObj.studentLast}
          </h1>
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

      <div className="fixed bottom-10 left-5">
        <Button onClick={handleLogout}>Logout</Button>
      </div>
    </div>
  )
}

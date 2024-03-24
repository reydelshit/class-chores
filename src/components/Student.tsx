import { useEffect, useState } from 'react'
import { Input } from './ui/input'
import { Label } from './ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from './ui/button'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import VerifyPassword from './VerifyPassword'
import PasswordStrengthBar from 'react-password-strength-bar'
import CryptoJS from 'crypto-js'

type StudentType = {
  studentFirst: string
  studentLast: string
  image: string
  groupAssigned: string
  student_id: number
}

type EventChange =
  | React.ChangeEvent<HTMLInputElement>
  | React.ChangeEvent<HTMLTextAreaElement>

export default function Student() {
  const secretKey = 'jedaya_secretkey'
  const chores_token = localStorage.getItem('chores_token') as string
  const bytes2 = CryptoJS.AES.decrypt(chores_token.toString(), secretKey)

  const plaintext2 = bytes2.toString(CryptoJS.enc.Utf8)

  console.log(plaintext2)

  if (plaintext2 === 'student') {
    return (window.location.href = '/student/sched')
  }
  const [image, setImage] = useState('')
  const [group, setGroup] = useState('')

  const [showReauth, setShowReauth] = useState(false)
  const [storeDeleteID, setStoreDeleteID] = useState<number>(0)

  const [studentDetails, setStudentDetails] = useState({
    studentFirst: '',
    studentLast: '',
    username: '',
    password: '',
  })

  const navigate = useNavigate()

  const [students, setStudents] = useState<StudentType[]>([])
  const [search, setSearch] = useState('')
  const [filteredGroups, setFilteredGroups] = useState('')
  const [showUpdateForm, setShowUpdateForm] = useState(false)
  const [studentID, setStudentID] = useState(0)

  const getAllStudents = () => {
    axios
      .get(`${import.meta.env.VITE_CLASS_CHORES}/student.php`)
      .then((res) => {
        console.log(res.data, 'reports')
        if (res.data.length > 0) {
          setStudents(res.data)
        }
      })
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    console.log('dsadas')
    e.preventDefault()
    axios
      .post(`${import.meta.env.VITE_CLASS_CHORES}/student.php`, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        ...studentDetails,
        image,
        groupAssigned: group,
        type: 'student',
      })
      .then((res) => {
        console.log(res.data)
        getAllStudents()

        window.location.reload()
      })
  }

  useEffect(() => {
    getAllStudents()
  }, [])

  const handleChangeImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const data = new FileReader()
    data.readAsDataURL(e.target.files![0])

    data.onloadend = () => {
      const base64 = data.result
      if (base64) {
        setImage(base64.toString())

        // console.log(base64.toString());
      }
    }
  }

  const handleSelectGroup = (value: string) => {
    setGroup(value)
  }

  const handleInputChange = (e: EventChange) => {
    const { name, value } = e.target
    console.log(name, value)
    setStudentDetails((values) => ({ ...values, [name]: value }))
  }

  const handleFilteredGroup = (value: string) => {
    setFilteredGroups(value)
  }

  const handleDelete = (id: number) => {
    const reauthToken = localStorage.getItem('chores_reauth') as string

    console.log(id)

    if (reauthToken === '0') {
      setShowReauth(true)
      setStoreDeleteID(id)
    } else {
      axios
        .delete(`${import.meta.env.VITE_CLASS_CHORES}/student.php`, {
          data: {
            id,
          },
        })
        .then((res) => {
          console.log(res.data)
          getAllStudents()
        })
    }
  }

  const handleShowsUpdateForm = (id: number) => {
    setShowUpdateForm(true)
    setStudentID(id)
    axios
      .get(`${import.meta.env.VITE_CLASS_CHORES}/student.php`, {
        params: { student_id: id },
      })
      .then((res) => {
        console.log(res.data)
        setStudentDetails(res.data[0])
        setImage(res.data[0].image)
        setGroup(res.data[0].groupAssigned)
      })
  }

  const handleSubmitUpdate = (e: React.FormEvent<HTMLFormElement>) => {
    console.log('dsadas')
    e.preventDefault()
    axios
      .put(`${import.meta.env.VITE_CLASS_CHORES}/student.php`, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        ...studentDetails,
        image: image.length > 0 ? image : image,
        groupAssigned: group.length > 0 ? group : group,
        type: 'student',
        student_id: studentID,
      })
      .then((res) => {
        console.log(res.data)
        getAllStudents()

        setShowUpdateForm(false)

        // window.location.reload()
      })
  }

  const handleExport = () => {
    const printableArea = document.getElementById('divToPrint')
    const printContents = printableArea!.innerHTML
    const originalContents = document.body.innerHTML

    document.body.innerHTML = printContents

    window.print()

    document.body.innerHTML = originalContents
  }

  return (
    <div className="flex justify-center items-center w-full h-[70vh] relative">
      {showReauth && (
        <VerifyPassword
          phpFile="student"
          deleteIDColumn="id"
          storeDeleteID={storeDeleteID}
          setShowReauth={setShowReauth}
          decrypt={getAllStudents}
        />
      )}

      <div className="flex w-[80%] justify-around gap-[10rem] p-4 ">
        <div className="w-[40rem] h-fit p-4 rounded-xl">
          <Button onClick={() => navigate(-1)}>Go back</Button>
          <form onSubmit={handleSubmit}>
            <div className="my-2">
              <Label>Image</Label>
              <Input
                className="bg-white text-black"
                onChange={handleChangeImage}
                required
                type="file"
                accept="image/*"
              />
            </div>
            <div>
              <Label>First Name</Label>
              <Input
                required
                defaultValue={studentDetails.studentFirst}
                onChange={handleInputChange}
                name="studentFirst"
                type="text"
              />
            </div>

            <div>
              <Label>Last Name</Label>
              <Input
                required
                defaultValue={studentDetails.studentLast}
                onChange={handleInputChange}
                name="studentLast"
                type="text"
              />
            </div>

            <div className="w-full h-fit mb-[1rem] ">
              <Label className="text-start block my-4">List of groups</Label>
              <Select required onValueChange={handleSelectGroup}>
                <SelectTrigger>
                  <SelectValue placeholder="Groups" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Group 1">Group 1</SelectItem>
                  <SelectItem value="Group 2">Group 2</SelectItem>
                  <SelectItem value="Group 3">Group 3</SelectItem>
                  <SelectItem value="Group 4">Group 4</SelectItem>
                  <SelectItem value="Group 5">Group 5</SelectItem>
                  <SelectItem value="Group 6">Group 6</SelectItem>
                  <SelectItem value="Group 7">Group 7</SelectItem>
                  <SelectItem value="Group 8">Group 8</SelectItem>
                  <SelectItem value="Group 9">Group 9</SelectItem>
                  <SelectItem value="Group 10">Group 10</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Username</Label>
              <Input
                required
                onChange={handleInputChange}
                name="username"
                type="text"
              />
            </div>

            <div>
              <Label>Password</Label>
              <Input
                required
                onChange={handleInputChange}
                name="password"
                type="password"
              />
            </div>

            <PasswordStrengthBar
              className="w-full my-4"
              password={studentDetails.password}
            />

            <Button className="my-2" type="submit">
              Submit
            </Button>
          </form>
        </div>

        <div className="w-[80%]">
          <div className="flex justify-between gap-4">
            <Input
              onChange={(e) => setSearch(e.target.value)}
              className="w-[20rem]"
              placeholder="Search"
            />
            <Select required onValueChange={handleFilteredGroup}>
              <SelectTrigger className="w-[20rem]">
                <SelectValue placeholder="Groups" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All</SelectItem>
                <SelectItem value="Group 1">Group 1</SelectItem>
                <SelectItem value="Group 2">Group 2</SelectItem>
                <SelectItem value="Group 3">Group 3</SelectItem>
                <SelectItem value="Group 4">Group 4</SelectItem>
                <SelectItem value="Group 5">Group 5</SelectItem>
                <SelectItem value="Group 6">Group 6</SelectItem>
                <SelectItem value="Group 7">Group 7</SelectItem>
                <SelectItem value="Group 8">Group 8</SelectItem>
                <SelectItem value="Group 9">Group 9</SelectItem>
                <SelectItem value="Group 10">Group 10</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead></TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Group</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students
                .filter((stud) => {
                  const matchesSearch =
                    !search || stud.studentLast.includes(search)
                  const matchesGroups =
                    filteredGroups === 'All' ||
                    stud.groupAssigned.includes(filteredGroups) ||
                    filteredGroups === ''

                  return matchesSearch && matchesGroups
                })
                .map((student, index) => {
                  return (
                    <TableRow key={index}>
                      <TableCell>
                        <img
                          className="w-[5rem] h-[5rem] object-cover"
                          src={student.image}
                          alt="image"
                        />
                      </TableCell>
                      <TableCell>
                        {student.studentFirst + ' ' + student.studentLast}
                      </TableCell>

                      <TableCell>{student.groupAssigned}</TableCell>
                      <TableCell>
                        <Button
                          onClick={() =>
                            handleShowsUpdateForm(student.student_id)
                          }
                          className="bg-green-500 mr-2"
                        >
                          Edit
                        </Button>
                        <Button
                          onClick={() => handleDelete(student.student_id)}
                          className="bg-red-500 "
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })}
            </TableBody>
          </Table>
        </div>
      </div>

      {showUpdateForm && (
        <div className="absolute w-full h-screen bg-white bg-opacity-75 flex justify-center items-center">
          <div className="w-[40rem] h-fit p-4 rounded-xl bg-white border-2">
            <form onSubmit={handleSubmitUpdate}>
              <div className="flex justify-center">
                <img className="w-[8rem]" src={image} alt="" />
              </div>
              <div className="my-2">
                <Label>Image</Label>
                <Input
                  className="bg-white text-black"
                  onChange={handleChangeImage}
                  type="file"
                  accept="image/*"
                />
              </div>
              <div>
                <Label>First Name</Label>
                <Input
                  defaultValue={studentDetails.studentFirst}
                  onChange={handleInputChange}
                  name="studentFirst"
                  type="text"
                />
              </div>

              <div>
                <Label>Last Name</Label>
                <Input
                  defaultValue={studentDetails.studentLast}
                  onChange={handleInputChange}
                  name="studentLast"
                  type="text"
                />
              </div>

              <div className="w-full h-fit mb-[1rem] ">
                <Label className="text-start block my-4">List of groups</Label>
                <Label className="bg-green-500 p-1 rounded-sm text-white my-4 block">
                  Current Group: {group}
                </Label>
                <Select onValueChange={handleSelectGroup}>
                  <SelectTrigger>
                    <SelectValue placeholder="Groups" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Group 1">Group 1</SelectItem>
                    <SelectItem value="Group 2">Group 2</SelectItem>
                    <SelectItem value="Group 3">Group 3</SelectItem>
                    <SelectItem value="Group 4">Group 4</SelectItem>
                    <SelectItem value="Group 5">Group 5</SelectItem>
                    <SelectItem value="Group 6">Group 6</SelectItem>
                    <SelectItem value="Group 7">Group 7</SelectItem>
                    <SelectItem value="Group 8">Group 8</SelectItem>
                    <SelectItem value="Group 9">Group 9</SelectItem>
                    <SelectItem value="Group 10">Group 10</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-4">
                <Button onClick={() => setShowUpdateForm(false)}>Cancel</Button>
                <Button type="submit">Submit</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

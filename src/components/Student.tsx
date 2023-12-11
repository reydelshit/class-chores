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

type StudentType = {
  studentFirst: string
  studentLast: string
  image: string
  groupAssigned: string
}

type EventChange =
  | React.ChangeEvent<HTMLInputElement>
  | React.ChangeEvent<HTMLTextAreaElement>

export default function Student() {
  const [image, setImage] = useState('')
  const [group, setGroup] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const [studentDetails, setStudentDetails] = useState({
    studentFirst: '',
    studentLast: '',
  })

  const [students, setStudents] = useState<StudentType[]>([])
  const [search, setSearch] = useState('')
  const [filteredGroups, setFilteredGroups] = useState('')

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
        username,
        password,
      })
      .then((res) => {
        console.log(res.data)
        getAllStudents()

        setStudentDetails({
          studentFirst: '',
          studentLast: '',
        })
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

    if (name === 'studentFirst') {
      const random = Math.floor(Math.random() * 1000)
      setUsername(value.toLowerCase() + random)
    }

    if (name === 'studentLast') {
      const random = Math.floor(Math.random() * 1000)
      setPassword(value.toLowerCase() + random)
    }
  }

  const handleFilteredGroup = (value: string) => {
    setFilteredGroups(value)
  }

  return (
    <div className="flex justify-center items-center w-full h-screen">
      <div className="flex w-[80%] justify-around gap-[10rem] p-4">
        <div className="w-[40rem] h-fit bg-green-100 p-4 rounded-xl">
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

            {studentDetails.studentFirst.length > 0 && (
              <div className="my-4 flex justify-between">
                <div>
                  <Label>Account</Label>
                  <div className="flex flex-col">
                    <Label>Username: {username}</Label>
                    <Label>Password: {password}</Label>
                  </div>
                </div>
                <Button>Export</Button>
              </div>
            )}

            <Button type="submit">Submit</Button>
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
                          className="w-[5rem]"
                          src={student.image}
                          alt="image"
                        />
                      </TableCell>
                      <TableCell>
                        {student.studentFirst + ' ' + student.studentLast}
                      </TableCell>

                      <TableCell>{student.groupAssigned}</TableCell>
                      <TableCell>
                        <Button className="bg-green-500 mr-2">Edit</Button>
                        <Button className="bg-red-500 ">Delete</Button>
                      </TableCell>
                    </TableRow>
                  )
                })}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}

import { useState } from 'react'
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

type EventChange =
  | React.ChangeEvent<HTMLInputElement>
  | React.ChangeEvent<HTMLTextAreaElement>

export default function Student() {
  const [image, setImage] = useState('' as any)
  const [group, setGroup] = useState('' as any)

  const [studentDetails, setStudentDetails] = useState({
    studentFirst: '',
    studentLast: '',
  })

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
      })
      .then((res) => {
        console.log(res.data)
      })
  }

  return (
    <div className="flex justify-center items-center w-full h-screen">
      <div className="flex w-full justify-around gap-[10rem] p-4">
        <div className="w-[40rem] bg-green-100 p-4 rounded-xl">
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

            <div className="w-full h-fit mb-[2rem] ">
              <Label className="text-start block my-4">List of groups</Label>
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

            <Button type="submit">Submit</Button>
          </form>
        </div>

        <div className="w-[80%]">
          <Table>
            <TableCaption>A list of your recent invoices.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Invoice</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Method</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">INV001</TableCell>
                <TableCell>Paid</TableCell>
                <TableCell>Credit Card</TableCell>
                <TableCell className="text-right">$250.00</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}

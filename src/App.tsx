import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin, { EventDragStartArg } from '@fullcalendar/interaction'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { DragEventHandler, useEffect, useState } from 'react'
import {
  EventApi,
  DateSelectArg,
  EventClickArg,
  EventContentArg,
  formatDate,
  EventChangeArg,
} from '@fullcalendar/core'

import timeGridPlugin from '@fullcalendar/timegrid'

import { EventInput } from '@fullcalendar/core'
import { Input } from './components/ui/input'
import { Button } from './components/ui/button'

import { Label } from './components/ui/label'
import axios from 'axios'

import moment from 'moment'
import { Link, useNavigate } from 'react-router-dom'
import Header from './components/Header'
// import DefaultProfile from '@/assets/default.jpg'
type PatientType = {
  patient_id: number
  patient_name: string
  patient_middlename: string
  patient_lastname: string
  patient_birthday: string
  patient_age: number
  patient_gender: string
  patient_email: string
  patient_phone: string
  patient_type: string
  patient_image: string
  weight: string
  height: string
}

export default function App() {
  const type = localStorage.getItem('chores_type')
  if (type === 'student') {
    return (window.location.href = '/student/sched')
  }

  const [state, setState] = useState({
    weekendsVisible: true,
    currentEvents: [],
  }) as any

  const [addAppointment, setAddAppointment] = useState(false)
  const [title, setTitle] = useState('' as any)
  const [selectInfo, setSelectInfo] = useState({} as any)
  const [scheduled, setScheduled] = useState<EventInput[]>([])
  const [selectedGroup, setSelectedGroup] = useState('')

  const chores_token = localStorage.getItem('chores_token') as string
  const navigate = useNavigate()
  const getSchedule = async () => {
    await axios
      .get(`${import.meta.env.VITE_CLASS_CHORES}/schedule.php`)
      .then((res) => {
        setScheduled(res.data.map((appointment: EventInput[]) => appointment))
        console.log(res.data)
      })
  }

  useEffect(() => {
    if (!chores_token) {
      navigate('/login')
    }
  }, [])

  useEffect(() => {
    getSchedule()

    console.log(scheduled, 'useeffect')
  }, [])

  const selectDate = (selectInfo: DateSelectArg) => {
    console.log(selectInfo)

    setSelectInfo(selectInfo)
    setAddAppointment(true)
  }

  const handleDateSelect = (
    selectInfo: DateSelectArg,
    selectedGroup: string,
  ) => {
    // setAddAppointment(true)

    // let title = prompt('Please enter a new title for your appointment')

    let calendarApi = selectInfo.view.calendar
    calendarApi.unselect()
    if (title) {
      calendarApi.addEvent({
        title,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        allDay: selectInfo.allDay,
      })
      setAddAppointment(false)

      // console.log(selectInfo)

      axios
        .post(`${import.meta.env.VITE_CLASS_CHORES}/schedule.php`, {
          sched_title: title,
          start: selectInfo.startStr,
          end: selectInfo.endStr,
          allDay: selectInfo.allDay,
          selectedGroup,
        })
        .then((res) => {
          console.log(res.data)

          if (res.data.status === 'success') {
            handleNotification(selectedGroup, selectInfo.startStr, title)
            setTitle('')
            // sendSMStoPatient(patient_id, selectInfo.startStr)
          }
        })
    }
  }

  const handleNotification = (
    selectedGroup: string,
    startDate: string,
    title: string,
  ) => {
    axios
      .post(`${import.meta.env.VITE_CLASS_CHORES}/notification.php`, {
        receiver_id: parseInt(selectedGroup.split(' ')[1]),
        sender_id: localStorage.getItem('chores'),
        notification_message: `You have a new schedule on ${moment(
          startDate,
        ).format('lll')} ${title}`,
      })
      .then((res) => {
        console.log(res.data)
      })
  }

  const handleEventClick = (clickInfo: EventClickArg) => {
    console.log(clickInfo.event)
    if (
      confirm(
        `Are you sure you want to delete the event '${clickInfo.event.title}'`,
      )
    ) {
      axios
        .delete(
          `${import.meta.env.VITE_CLASS_CHORES}/schedule.php/${
            clickInfo.event.id
          }`,
        )
        .then((res) => {
          console.log(res.data)
        })
      clickInfo.event.remove()
    }
  }

  const handleChangeSchedule = (eventChange: EventChangeArg) => {
    console.log(eventChange.event.title)

    // console.log('nice')
    // console.log(eventInfo.event)
    axios
      .put(`${import.meta.env.VITE_CLASS_CHORES}/schedule.php`, {
        sched_id: eventChange.event.id,
        sched_title: eventChange.event.title,
        start: eventChange.event.startStr,
        end: eventChange.event.endStr,
        allDay: eventChange.event.allDay,
      })
      .then((res) => {
        console.log(res.data)
      })
  }

  const handleSchedule = (events: EventApi[]) => {
    setState({
      currentEvents: events,
    })
  }

  const handleSelectGroup = (value: string) => {
    setTitle(value)
    setSelectedGroup(value)
  }

  const renderSidebar = () => {
    return (
      <div className="w-[20rem] ">
        <div className="h-[5rem] my-[5rem]">
          <Link to="/students">
            <Button className="w-full mb-2">Students</Button>
            <Button className="w-full">View Students</Button>
          </Link>
        </div>

        <div className="border-2 text-sm p-2 rounded-md">
          <span className="block text-base font-semibold">
            All Schedule ({state.currentEvents.length})
          </span>
          <span className="text-md">
            {state.currentEvents.map(renderSidebarEvent)}
          </span>
        </div>
      </div>
    )
  }

  const renderEventContent = (eventContent: EventContentArg) => {
    return (
      <>
        <b>{eventContent.timeText}</b>
        <i>{eventContent.event.title}</i>
      </>
    )
  }

  const renderSidebarEvent = (event: EventApi) => {
    return (
      <div className="flex gap-1" key={event.id}>
        <span>
          {formatDate(event.start!, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })}
        </span>
        <p className="font-bold">{event.title}</p>
      </div>
    )
  }

  return (
    <div className="relative flex flex-col items-center h-screen w-full">
      {addAppointment && (
        <div className="w-full bg-white bg-opacity-90 z-20 absolute my-auto p-2 h-full flex justify-center ">
          <div className=" w-[30rem] flex-col flex gap-2 my-5 border-2 p-4 bg-white rounded-md h-fit mt-[12rem]">
            <div className="w-full">
              <div className="w-full h-fit mb-[2rem] ">
                <Label className="text-end block my-4">List of groups</Label>
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
              <Label className="mb-2 block">
                Schedule Group eg. Group 1 - Chores
              </Label>
              <Input
                value={title}
                placeholder="Group name / title"
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="my-2">
              <p className="text-xs">
                <strong>Note:</strong> Upon adding schedule, the push
                notification will automatically send to the students.
              </p>
            </div>
            <div className="flex gap-2 self-end">
              <Button
                className="bg-white border-2 text-black"
                onClick={() => setAddAppointment(false)}
              >
                Cancel
              </Button>

              <Button
                onClick={() => handleDateSelect(selectInfo, selectedGroup)}
              >
                Add Schedule
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="flex gap-4 w-[80%] mt-[5rem]">
        {renderSidebar()}
        <div className="w-full">
          {scheduled.length > 0 && (
            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              headerToolbar={{
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay',
              }}
              eventBackgroundColor="green"
              eventBorderColor="green"
              initialView="dayGridMonth"
              editable={true}
              selectable={true}
              selectMirror={true}
              dayMaxEvents={true}
              initialEvents={scheduled} // alternatively, use the `events` setting to fetch from a feed
              select={selectDate}
              eventContent={renderEventContent} // custom render function
              eventClick={handleEventClick}
              eventsSet={handleSchedule} // called after events are initialized/added/changed/removed
              // you can update a remote database when these fire:
              // eventAdd={() => handleAppointmentsDatabaase}
              eventChange={handleChangeSchedule}
              // eventRemove={function(){}}
            />
          )}
        </div>
      </div>
    </div>
  )
}

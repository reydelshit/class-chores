import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import App from '@/App'
import Header from '@/components/Header'

export default function Root() {
  const location = useLocation()
  const navigate = useNavigate()

  if (!localStorage.getItem('chores_token')) {
    window.location.href = '/login'
  }

  const handleLogout = () => {
    localStorage.removeItem('chores_token')
    localStorage.removeItem('chores_')
    localStorage.removeItem('chores_reauth')
    window.location.href = '/login'
  }
  return (
    <div className="w-full ">
      <Header />
      <div className="flex ">
        <div className="w-full px-2">
          {location.pathname === '/' ? <App /> : <Outlet />}
        </div>
      </div>
      <div className="fixed bottom-10 left-5">
        <Button onClick={handleLogout}>Logout</Button>
      </div>
    </div>
  )
}

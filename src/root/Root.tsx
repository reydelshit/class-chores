import { Outlet, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import App from '@/App'
import Header from '@/components/Header'

export default function Root() {
  const location = useLocation()
  const handleLogout = () => {
    localStorage.removeItem('chores')
    localStorage.removeItem('chores_type')
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

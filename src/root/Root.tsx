import { Outlet, useLocation } from 'react-router-dom'

import App from '@/App'

export default function Root() {
  const location = useLocation()

  return (
    <div className="w-full ">
      <div className="flex ">
        <div className="w-full px-2">
          {location.pathname === '/' ? <App /> : <Outlet />}
        </div>
      </div>
    </div>
  )
}

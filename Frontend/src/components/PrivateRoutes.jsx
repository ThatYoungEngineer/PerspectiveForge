import { useSelector } from 'react-redux'
import { Outlet, Navigate, useLocation } from 'react-router-dom'

const PrivateRoutes = () => {
    const location = useLocation()
    const { currentUser } = useSelector(state=>state.user)

    return currentUser ? <Outlet /> : <Navigate to={'/login'} />
}

export default PrivateRoutes
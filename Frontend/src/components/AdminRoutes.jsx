import { useSelector } from 'react-redux'
import { Outlet, Navigate } from 'react-router-dom'

const PrivateRoutes = () => {
    
    const { currentUser } = useSelector(state=>state.user)

    return currentUser.userData.isAdmin ? <Outlet /> : <Navigate to={'/dashboard'} />
}

export default PrivateRoutes
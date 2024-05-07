import { useSelector } from "react-redux"
import { Outlet } from "react-router-dom"
import { Navigate } from "react-router"

const AuthRoutes = () => {

    const { currentUser } = useSelector(state=>state.user)
    const data = currentUser?.userData

    return data ? <Navigate to={'/dashboard?tab=profile'} /> : <Outlet />
}

export default AuthRoutes

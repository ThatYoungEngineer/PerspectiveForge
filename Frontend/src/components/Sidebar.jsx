import { Sidebar as FlowbiteSidebar } from "flowbite-react"
import { HiArrowRight, HiUserCircle } from "react-icons/hi"
import { useDispatch, useSelector } from "react-redux"
import { signOut } from "../store/userSlice"
import { Link } from "react-router-dom"
import { MdDashboard } from "react-icons/md"

const Sidebar = () => {
    const dispatch = useDispatch()
    const { currentUser } = useSelector(state=>state.user)
    const { theme } = useSelector(state=>state.theme)

    const handleSignOut = () => {
        dispatch(signOut())
    }

  return (
    <>
        <FlowbiteSidebar>   
            <FlowbiteSidebar.ItemGroup className="flex flex-col gap-1">
                <Link to={'/dashboard?tab=create-new-post'}>
                    <FlowbiteSidebar.Item icon={MdDashboard} as='div' >
                        Dashboard
                    </FlowbiteSidebar.Item>
                </Link>
                <Link to={'/dashboard?tab=profile'}>
                    <FlowbiteSidebar.Item icon={HiUserCircle} active label={currentUser.userData.isAdmin ? 'Admin' : 'User'} labelColor={theme} as='div' >
                        Profile
                    </FlowbiteSidebar.Item>
                </Link>
                <FlowbiteSidebar.Item icon={HiArrowRight} className='cursor-pointer' onClick={handleSignOut} >
                    Sign Out 
                </FlowbiteSidebar.Item>
            </FlowbiteSidebar.ItemGroup>
        </FlowbiteSidebar>
    </>
  )
}

export default Sidebar
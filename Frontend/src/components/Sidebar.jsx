import { Sidebar as FlowbiteSidebar } from "flowbite-react"
import { HiArrowRight, HiUserCircle } from "react-icons/hi"
import { useDispatch, useSelector } from "react-redux"
import { signOut } from "../store/userSlice"
import { Link } from "react-router-dom"

const Sidebar = () => {
    const dispatch = useDispatch()
    const { theme } = useSelector(state=>state.theme)

    const handleSignOut = () => {
        dispatch(signOut())
    }

  return (
    <>
        <FlowbiteSidebar>   
            <FlowbiteSidebar.ItemGroup>
                <Link to={'/dashboard?tab=profile'}>
                    <FlowbiteSidebar.Item icon={HiUserCircle} active label='user' labelColor={theme} as='div' >
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
import { Sidebar as FlowbiteSidebar } from "flowbite-react"
import { HiArrowRight, HiUserCircle } from "react-icons/hi"
import { useDispatch, useSelector } from "react-redux"
import { signOut } from "../store/userSlice"

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
                <FlowbiteSidebar.Item icon={HiUserCircle} active label='user' labelColor={theme} >
                    Profile
                </FlowbiteSidebar.Item>
                <FlowbiteSidebar.Item icon={HiArrowRight} className='cursor-pointer' onClick={handleSignOut} >
                    Sign Out 
                </FlowbiteSidebar.Item>
            </FlowbiteSidebar.ItemGroup>
        </FlowbiteSidebar>
    </>
  )
}

export default Sidebar
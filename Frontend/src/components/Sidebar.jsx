import { Sidebar as FlowbiteSidebar } from "flowbite-react"
import { HiArrowRight, HiDocumentText, HiUserCircle } from "react-icons/hi"
import { useDispatch, useSelector } from "react-redux"
import { signOut } from "../store/userSlice"
import { Link, useLocation } from "react-router-dom"
import { MdDashboard } from "react-icons/md"
import { useEffect, useState } from "react"

const Sidebar = () => {
    const [tab, setTab] = useState(null)
    const [ dash, setDash ] = useState(false)
    const dispatch = useDispatch()
    const location = useLocation()
    const { currentUser } = useSelector(state=>state.user)
    const { theme } = useSelector(state=>state.theme)

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search)
        const tabFromURL = urlParams.get("tab")
        if (tabFromURL) {
            setTab(tabFromURL)
            setDash(false)
        }
        if (location.pathname=='/dashboard' && !location.search) {
            setDash(true)
            setTab(null)
        } else {
            setDash(false)
        }
    }, [location.search])

    const handleSignOut = () => {
        dispatch(signOut())
    }

  return (
    <>
        <FlowbiteSidebar className="">   
            <FlowbiteSidebar.ItemGroup className="flex flex-col gap-1">
                <Link to={'/dashboard'}>
                    <FlowbiteSidebar.Item icon={MdDashboard} as='div' active={dash} >
                        Dashboard
                    </FlowbiteSidebar.Item>
                </Link>
                <Link to={'/dashboard?tab=profile'}>
                    <FlowbiteSidebar.Item icon={HiUserCircle} active={tab=='profile'} label={currentUser.userData.isAdmin ? 'Admin' : 'User'} labelColor={theme} as='div' >
                        Profile
                    </FlowbiteSidebar.Item>
                </Link>
                {currentUser.userData.isAdmin &&
                    <Link to={'/dashboard?tab=posts'}>
                        <FlowbiteSidebar.Item
                            icon={HiDocumentText}
                            active={tab=='posts'||tab=='create-new-post'}
                            as='div'
                        >
                            Posts
                        </FlowbiteSidebar.Item>
                    </Link>
                }
                <FlowbiteSidebar.Item icon={HiArrowRight} className='cursor-pointer' onClick={handleSignOut} >
                    Sign Out 
                </FlowbiteSidebar.Item>
            </FlowbiteSidebar.ItemGroup>
        </FlowbiteSidebar>
    </>
  )
}

export default Sidebar
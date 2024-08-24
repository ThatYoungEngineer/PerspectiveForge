import { Sidebar as FlowbiteSidebar } from "flowbite-react"
import { HiArrowRight, HiDocumentText, HiUserCircle } from "react-icons/hi"
import { useDispatch, useSelector } from "react-redux"
import { signOut } from "../store/userSlice"
import { Link, useLocation } from "react-router-dom"
import { MdDashboard } from "react-icons/md"
import { useEffect, useState } from "react"
import { FaAngleDown } from "react-icons/fa"
import { IoCreate } from "react-icons/io5"
import { MdOutlineManageSearch } from "react-icons/md"

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
                    <>
                        <FlowbiteSidebar.Item
                            icon={HiDocumentText}
                            active={tab=='posts'||tab=='create-new-post'}
                            as='div'
                            className="relative"
                        >
                            Posts
                            <FaAngleDown className="absolute transform top-1/2 -translate-y-1/2 right-3" />
                        </FlowbiteSidebar.Item>
                        <div className="w-full h-20 flex flex-col gap-5 pl-8">
                            <Link to='/dashboard?tab=create-new-post' className="flex"> 
                                <IoCreate className="self-center mr-2" size={20} /> Create Post
                             </Link>
                            <Link to='/dashboard?tab=posts' className="flex">
                                <MdOutlineManageSearch className="self-center mr-2" size={20}/> Manage Post 
                            </Link>
                        </div>
                    </>
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
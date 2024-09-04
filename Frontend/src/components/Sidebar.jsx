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
    const dispatch = useDispatch()
    const location = useLocation()
    const [ tab, setTab ] = useState(null)
    const [ dash, setDash ] = useState(false)
    const [ postOptions, setPostOptions ] = useState(false)
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
                {currentUser.userData.isAdmin &&
                    <Link to={'/dashboard'}>
                        <FlowbiteSidebar.Item icon={MdDashboard} as='div' active={dash} >
                            Dashboard
                        </FlowbiteSidebar.Item>
                    </Link>
                }
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
                            className="relative cursor-pointer"
                            onClick={() => setPostOptions(  prev => !prev )}
                        >
                            Posts
                            <FaAngleDown active className={`absolute transform top-1/2 -translate-y-1/2 right-3 transition-transform ${postOptions && 'rotate-180'}`} />
                        </FlowbiteSidebar.Item>
                        {postOptions &&
                            <div className="w-full h-24 flex flex-col gap-2 pl-6" >
                                <Link to='/dashboard?tab=create-new-post' > 
                                    <FlowbiteSidebar.Item icon={IoCreate}
                                        active={tab=='create-new-post'}
                                        as='div'                                    
                                    >
                                        Create Post
                                    </FlowbiteSidebar.Item>
                                </Link>
                                <Link to='/dashboard?tab=posts' >
                                    <FlowbiteSidebar.Item icon={MdOutlineManageSearch}
                                        active={tab=='posts'}
                                        as='div'
                                    >
                                        Manage Post
                                    </FlowbiteSidebar.Item>
                                </Link>
                            </div>
                        }
                    </>
                }
                <FlowbiteSidebar.Item 
                    icon={HiArrowRight} onClick={handleSignOut}
                    className='cursor-pointer'
                >
                    Sign Out 
                </FlowbiteSidebar.Item>
            </FlowbiteSidebar.ItemGroup>
        </FlowbiteSidebar>
    </>
  )
}

export default Sidebar

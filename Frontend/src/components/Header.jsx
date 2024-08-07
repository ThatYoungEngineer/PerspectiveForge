import { Navbar, Button, Dropdown, Avatar } from "flowbite-react"
import { useNavigate, Link } from "react-router-dom"
import { FaMoon, FaSun } from 'react-icons/fa'
import { HiLogout } from "react-icons/hi"

import logo from "../assets/images/PerspectiveForge.png"
import logoLight from "../assets/images/PerspectiveForge-light.png"
import { useSelector, useDispatch } from "react-redux"
import { toggleTheme } from "../store/themeSlice"
import { signOut } from "../store/userSlice"

const Header = () => {

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { currentUser } = useSelector(state=>state.user)
    const { theme } = useSelector(state=>state.theme)

    const handleThemeChange = () => {
        dispatch(toggleTheme())
    }

    const handleSignOut = () => {
        dispatch(signOut())
    }

    return (
    <>
        <Navbar fluid rounded border >
            <Navbar.Brand onClick={() => navigate('/')} className="w-24 md:w-44" >
                {theme === 'light' 
                    ? <img src={logo} className="w-24 md:w-44 cursor-pointer" alt="logo" /> 
                    : <img src={logoLight} className="w-24 md:w-44 cursor-pointer" alt="logo" /> 
                }
            </Navbar.Brand>
            <div className="flex gap-3 md:order-2 items-center justify-end w-24 md:w-44 ">
                <Button
                    className='w-12 h-10 hidden lg:flex items-center justify-center'
                    color='gray'
                    pill
                    onClick={handleThemeChange}
                >
                    { theme === 'light' ? <FaMoon /> : <FaSun /> }
                </Button>

                {currentUser?.userData 
                ?   <Dropdown
                        inline
                        arrowIcon={false}
                        label = {
                            <Avatar 
                                alt="user"
                                img={currentUser.userData.profilePhoto}
                                size='md'
                                rounded
                                className="border border-teal-300 rounded-full"
                            />
                        }
                    >
                        <Dropdown.Header>
                            <span className="block text-sm">{currentUser.userData.full_name}</span>
                            <span className="block text-sm font-medium truncate">{currentUser.userData.email}</span>
                        </Dropdown.Header>
                        {currentUser?.userData.isAdmin && (
                            <Link to={'/dashboard'}>
                                <Dropdown.Item>Dashboard</Dropdown.Item>
                            </Link>
                        )}
                        <Link to={'/dashboard?tab=profile'}>
                            <Dropdown.Item>Profile</Dropdown.Item>
                        </Link>
                        <Dropdown.Divider />
                        <Dropdown.Item icon={HiLogout} onClick={handleSignOut}>Sign Out</Dropdown.Item>
                    </Dropdown>
                :   <Link to={'/login'} >
                        <Button outline gradientDuoTone="purpleToBlue">
                            Login
                        </Button>
                    </Link> 
                }
                { currentUser?.userData && <Navbar.Toggle /> }
            </div>
            {currentUser?.userData && 
                <>
                    <Navbar.Collapse>
                        <div className="w-full sm:hidden flex items-center justify-center">
                            <Button
                                className='w-12 h-10 flex items-center justify-center mb-5'
                                color='gray'
                                pill
                                onClick={handleThemeChange}
                            >
                                { theme === 'light' ? <FaMoon /> : <FaSun /> }
                            </Button>
                        </div>
                        <div className="flex gap-2 flex-col items-center justify-center sm:block sm:space-x-5">
                            <Link to={'/'}> Home </Link>
                            <Link to={'/'}> About </Link>
                            <Link to={'/'}> Services </Link>
                            <Link to={'/'}> Pricing </Link>
                            <Link to={'/'}> Contact </Link>
                        </div>
                        <div className="mt-5 w-full sm:hidden flex items-center justify-center">
                        <Button
                            outline
                            gradientDuoTone='purpleToPink'
                            onClick={handleSignOut}
                            className="mb-5"    
                        >
                            Sign Out
                        </Button>
                        </div>
                    </Navbar.Collapse>
                </>
            }
        </Navbar>    
    </>
  )
}

export default Header

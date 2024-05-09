import { Navbar, Button, Dropdown, Avatar } from "flowbite-react"
import { useNavigate, Link } from "react-router-dom"
import { FaMoon, FaSun } from 'react-icons/fa'
import { HiLogout } from "react-icons/hi"

import logo from "../assets/images/PerspectiveForge.png"
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
            <Navbar.Brand onClick={() => navigate('/')} >
                <img src={logo} className=" w-44 cursor-pointer" alt="logo" />
            </Navbar.Brand>
            <div className="flex gap-2 md:order-2 items-center justify-center ">
                <Button
                    className='w-12 h-10 hidden sm:flex items-center justify-center'
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
                            />
                        }
                    >
                        <Dropdown.Header>
                            <span className="block text-sm">{currentUser.userData.full_name}</span>
                            <span className="block text-sm font-medium truncate">{currentUser.userData.email}</span>
                        </Dropdown.Header>
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
                <Navbar.Toggle />
            </div>
            <Navbar.Collapse>
                <div className="w-full sm:hidden flex items-center justify-center">
                    <Button
                        className='w-12 h-10 flex items-center justify-center'
                        color='gray'
                        pill
                        onClick={handleThemeChange}
                    >
                        { theme === 'light' ? <FaMoon /> : <FaSun /> }
                    </Button>
                </div>
                <Link to={'/'}> Home </Link>
                <Link to={'/'}> About </Link>
                <Link to={'/'}> Services </Link>
                <Link to={'/'}> Pricing </Link>
                <Link to={'/'}> Contact </Link>
            </Navbar.Collapse>
        </Navbar>    
    </>
  )
}

export default Header

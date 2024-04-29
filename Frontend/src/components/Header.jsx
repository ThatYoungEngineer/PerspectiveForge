import { Navbar, Button, Dropdown, Avatar } from "flowbite-react"
import { useNavigate, Link } from "react-router-dom"
import { FaMoon, FaSun } from 'react-icons/fa'

import logo from "../assets/images/PerspectiveForge.png"
import { useSelector, useDispatch } from "react-redux"
import { toggleTheme } from "../store/themeSlice"

const Header = () => {

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { currentUser } = useSelector(state=>state.user)
    const { theme } = useSelector(state=>state.theme)

    const handleThemeChange = () => {
        dispatch(toggleTheme())
    }

    console.log(currentUser)
  return (
    <>
        <Navbar fluid rounded border >
            <Navbar.Brand onClick={() => navigate('/')} >
                <img src={logo} className=" w-44 cursor-pointer" alt="logo" />
            </Navbar.Brand>
            <div className="flex gap-2 md:order-2">
                <Button
                    className='w-12 h-10 hidden sm:inline'
                    color='gray'
                    pill
                    onClick={handleThemeChange}
                >
                    { theme === 'light' ? <FaMoon /> : <FaSun /> }
                </Button>

                {currentUser 
                ? <Dropdown
                    className="w-48"                
                    arrowIcon={false}
                    inLine
                    label = {
                        <Avatar 
                            alt="user"
                            img={currentUser.profilePhoto} 
                            size='xs'
                            rounded
                        />
                    }
                >
                    <Dropdown.Header>
                        <span className="block text-sm">{currentUser.full_name}</span>
                        <span className="block text-sm font-medium truncate">{currentUser.email}</span>
                    </Dropdown.Header>
                    <Link to={'/dashboard?tab=profile'}>
                        <Dropdown.Item>Profile</Dropdown.Item>
                        <Dropdown.Divider />
                        <Dropdown.Item>Sign Out</Dropdown.Item>
                    </Link>
                </Dropdown>
                : <Button outline gradientDuoTone="purpleToBlue" onClick={() => navigate('/signup') }  >
                    Sign Up
                </Button>
                }
                <Navbar.Toggle />
            </div>
            
            <Navbar.Collapse>
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

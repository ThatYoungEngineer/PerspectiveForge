import { Footer as Feet }  from 'flowbite-react';
import { Link } from 'react-router-dom';
import { BsFacebook, BsInstagram, BsTwitter, BsGithub, BsDribbble } from 'react-icons/bs';
import logo from "../assets/images/PerspectiveForge.png"
import logoLight from "../assets/images/PerspectiveForge-light.png"
import { useSelector } from "react-redux"

const Footer = () => {
  const { theme } = useSelector(state=>state.theme)

  return (
    <Feet container className='border border-t-8 border-teal-500'>
      <div className='w-full max-w-7xl mx-auto'>
        <div className='grid w-full justify-between sm:flex md:grid-cols-1'>
          <div className='mt-5'>
            <Link
              to='/'
              className='self-center whitespace-nowrap text-lg sm:text-xl font-semibold dark:text-white'
            >
              {theme === 'light' 
                ? <img src={logo} className="w-40 md:w-44 cursor-pointer" alt="logo" /> 
                : <img src={logoLight} className="w-40 md:w-44 cursor-pointer" alt="logo" /> 
              }
            </Link>
          </div>
          <div className='grid grid-cols-2 gap-8 mt-4 sm:grid-cols-3 sm:gap-6'>
            <div>
                <Feet.Title title='About' />
                <Feet.LinkGroup col>
                  <Link to={'/about'}>
                    About
                  </Link>
                </Feet.LinkGroup>
            </div>
            <div>
              <Feet.Title title='Follow us' />
              <Feet.LinkGroup col>
                <Feet.Link
                  href='https://github.com/ThatYoungEngineer'
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  Github
                </Feet.Link>
                <Feet.Link href=''>Discord</Feet.Link>
              </Feet.LinkGroup>
            </div>
            <div>
              <Feet.Title title='Legal' />
              <Feet.LinkGroup col>
                <Feet.Link href=''>Privacy Policy</Feet.Link>
                <Feet.Link href=''>Terms &amp; Conditions</Feet.Link>
              </Feet.LinkGroup>
            </div>
          </div>
        </div>
        <Feet.Divider />
        <div className='w-full sm:flex sm:items-center sm:justify-between'>
          <Feet.Copyright
            href=''
            by="Perspective Forge"
            year={new Date().getFullYear()}
          />
          <div className="flex gap-6 sm:mt-0 mt-4 sm:justify-center">
            <Feet.Icon href='' icon={BsFacebook}/>
            <Feet.Icon href='' icon={BsInstagram}/>
            <Feet.Icon href='' icon={BsTwitter}/>
            <Feet.Icon href='https://github.com/ThatYoungEngineer' target='_blank' icon={BsGithub}/>
            <Feet.Icon href='' icon={BsDribbble}/>
          </div>
        </div>
      </div>
    </Feet>
  );
}

export default Footer
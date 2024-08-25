import heroBG from '../assets/images/bg-hero.webp'
import heroBGLight from '../assets/images/bg-hero-light.webp'
import btnBG from '../assets/images/btnBg.png'
import { FaArrowRight } from "react-icons/fa6"
import { BsStars } from "react-icons/bs"
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'

const Hero = () => {

  const { currentUser } = useSelector(state=>state.user)
  const { theme } = useSelector(state=>state.theme)

  const scrollToRecentPosts = () => {
    const scrollAmount = window.innerHeight * 1.15
    document.body.scrollTop = scrollAmount
    document.documentElement.scrollTop = scrollAmount
  }

  return (
    <main className='w-screen z-30 min-h-[650px] h-screen max-h-[950px] absolute top-0 left-0 pt-[20vh] lg:pt-[21vh] px-5 lg:px-0 flex items-start justify-center'>
      {theme == 'dark'
      ?  <img src={heroBG} alt="" className='absolute top-0 left-0 w-screen min-h-[650px] h-screen max-h-[950px] object-cover lg:object-right-top ' />
      : <img src={heroBGLight} alt="" className='absolute top-0 left-0 w-screen min-h-[650px] h-screen max-h-[950px] object-cover lg:object-right-top ' />
      }
      <article className='w-fit h-fit relative z-40 flex flex-col gap-10 items-center justify-start'>
        <Link to={`${currentUser?.userData ? '/dashboard' : '/login'}`}>
          <section className='w-fit bg-transparent rounded-full text-[.6rem] md-mobile:text-sm newFeatureShadow cursor-pointer'>
            <section className='flex gap-2 items-center rounded-full px-4 py-2 shadow-inner dark:shadow-[#8b9da2] shadow-[#fbfbfb] bg-[#1B3334] bg-opacity-0 group/icon transition-all ease-in-out duration-300'>
              <div className='bg-[#24787b] text-[#D3FFFF] py-0 px-3 rounded-full shadow-inner shadow-[#6eb1b4]'>New feature</div>
              <h4> Check out the dashboard </h4>
              <FaArrowRight className='group-hover/icon:ml-3 group-hover/icon:dark:text-[#ffd992] group-hover/icon:text-[#2e7e72] transition-all ease-in-out duration-300' />
            </section>
          </section>
        </Link>
        <section className={`flex flex-col gap-3 lg:gap-5 md:items-center justify-start text-center text-3xl md:text-6xl lg:text-7xl font-Onest-Medium  ${theme=='light'?'headingGradientDark':'headingGradient'}`}>
          <h2>In-depth knowledge of technology.</h2>
          <h2>The future of discovery.</h2>
        </section>
        <section className={`text-base lg:text-xl font-Onest-Regular md:w-[80%] lg:w-[60%] md:text-center ${theme=='light'?'contentGradientDark':'contentGradient'}`} >
          <h4>
            Powerful, self-serve team engagement tools and analytics. Supercharge your managers & keep employees engaged from anywhere.
          </h4>
        </section>
        <section className='newFeatureShadow rounded-full cursor-pointer' onClick={scrollToRecentPosts}>
          <div className='w-fit flex items-center justify-center gap-2 relative overflow-hidden p-3 dark:bg-[#2f8e95] bg-[#55aeb4] bg-opacity-100 rounded-full 
          shadow-inner dark:shadow-[#8b9da2] shadow-[#cfe5ec]'>
            <img src={btnBG} alt="" className='absolute top-0 left-0 w-full h-full object-cover object-center pointer-events-none bg-transparent ' />
            <BsStars />
            <h4 className='text-sm font-Onest-Regular'>Explore Now</h4>
          </div>
        </section>

        <section className='flex items-center justify-center'>
          <h4 className='text-lg dark:text-[#EAEAEA] text-[#1a1a1a] opacity-50 font-Onest-Regular'>Trusted by 4,000+ users</h4>
        </section>
      </article>
    </main>
  )
}

export default Hero
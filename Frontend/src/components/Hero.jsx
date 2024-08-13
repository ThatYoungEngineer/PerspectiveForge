import heroBG from '../assets/images/bg-hero.png'
import heroBGLight from '../assets/images/hero-light.png'
import btnBG from '../assets/images/btnBg.png'
import { FaArrowRight } from "react-icons/fa6"
import { BsStars } from "react-icons/bs"
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'

const Hero = () => {
  const { theme } = useSelector(state=>state.theme)
  return (
    <main className='w-screen z-30 h-screen absolute top-0 left-0 pt-[15vh] lg:pt-[21vh] px-5 lg:px-0 flex items-start justify-center'>
      {theme == 'dark'
      ?  <img src={heroBG} alt="" className='absolute top-0 left-0 w-screen min-h-[650px] h-screen object-cover lg:object-right-top ' />
      : <img src={heroBGLight} alt="" className='absolute top-0 left-0 w-screen min-h-[650px] h-screen object-cover lg:object-right-top ' />
      }
      <article className='w-fit h-fit relative z-40 flex flex-col gap-10 items-center justify-start'>
        <Link to='/dashboard'>
          <section className='w-fit bg-transparent rounded-full text-[.6rem] md-mobile:text-sm newFeatureShadow cursor-pointer'>
            <section className='flex gap-2 items-center rounded-full px-4 py-2 shadow-inner shadow-[#8b9da2] bg-[#1B3334] bg-opacity-15 '>
              <span className='bg-[#24787b] text-[#D3FFFF] py-0 px-3 rounded-full shadow-inner shadow-[#4e8f93]'>New feature</span>
              <h4> Check out the dashboard </h4>
              <FaArrowRight />
            </section>
          </section>
        </Link>
        <section className='flex flex-col gap-3 lg:gap-5 lg:items-center justify-start text-3xl lg:text-7xl font-Onest-Medium headingGradient'>
          <h2>High-performing remote teams.</h2>
          <h2>The future of work.</h2>
        </section>
        <section className='text-base lg:text-xl font-Onest-Regular lg:w-[60%] lg:text-center contentGradient'>
          <h4 className='leading-relaxed'>
            Powerful, self-serve team engagement tools and analytics. Supercharge your managers & keep employees engaged from anywhere.
          </h4>
        </section>
        <section className='newFeatureShadow rounded-full cursor-pointer'>
          <div className='w-fit flex items-center justify-center gap-2 relative overflow-hidden p-3 bg-[#2f8e95] bg-opacity-100 rounded-full 
          shadow-inner shadow-[#8b9da2]'>
            <img src={btnBG} alt="" className='absolute top-0 left-0 w-full h-full object-cover object-center pointer-events-none bg-transparent ' />
            <BsStars />
            <h4 className='text-sm font-Onest-Regular'>Explore Now</h4>
          </div>
        </section>

        <section className='flex items-center justify-center'>
          <h4 className='text-lg text-[#EAEAEA] opacity-50 font-Onest-Regular'>Trusted by 4,000+ users</h4>

        </section>




      </article>
    </main>
  )
}

export default Hero
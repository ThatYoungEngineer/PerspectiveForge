import frame from '../assets/images/bg-frame.png' 
import texture from '../assets/images/bg-texture.png' 
import pattern from '../assets/images/bg-pattern.png' 
import stars from '../assets/images/bg-stars.png' 

const Hero = () => {
  return (
    <section className='absolute top-0 left-0 w-screen h-full flex items-center justify-center'>
        <img src={frame} alt="" />
        <img src={texture} alt="" className='w-full absolute top-0 left-0 ' />
        <img src={pattern} alt="" className='w-full absolute top-0 left-0 object-fill' />
        <img src={stars} alt="" className='w-full absolute top-0 left-0 object-fill' />
    </section>
  )
}

export default Hero
import { assets } from '../assets/assets'

const About = () => {
  return (
    <div>
      <p className='text-center text-2xl my-10 font-medium'>ABOUT <span className='text-gray-800'>US</span></p>
      <div className='flex flex-col gap-10 sm:flex-row'>
        <img className='w-full sm:max-w-xs rounded-lg' src={assets.about_image} />
        <div className='flex gap-5 flex-col text-sm text-gray-600 lg:w-2/4'>
          <p>Welcome to Prescripto, your trusted partner in managing your healthcare needs conveniently and efficiently. At Prescripto, we understand the challenges individuals face when it comes to scheduling doctor appointments and managing their health records.</p>
          <p>Prescripto is committed to excellence in healthcare technology. We continuously strive to enhance our platform, integrating the latest advancements to improve user experience and deliver superior service. Whether you're booking your first appointment or managing ongoing care, Prescripto is here to support you every step of the way.</p>
          <b className='text-black'>Our Vision</b>
          <p>Our vision at Prescripto is to create a seamless healthcare experience for every user. We aim to bridge the gap between patients and healthcare providers, making it easier for you to access the care you need, when you need it.</p>
        </div>
      </div>
      <p className='mt-10 text-xl font-semibold'>WHY <span className='text-gray-800'>CHOOSE US</span></p>
      <div className='flex flex-col md:flex-row mt-5'>
        <div className='border cursor-pointer text-[15px] py-14 px-10 md:px16 md:py-16 flex flex-col gap-5 text-gray-700 hover:text-white hover:bg-blue-500'>
          <b>EFFICIENCY:</b>
          <p>Streamlined appointment scheduling that fits into your busy lifestyle.</p>
        </div>
        <div className='border cursor-pointer text-[15px] py-14 px-10 md:px16 md:py-16 flex flex-col gap-5  text-gray-700 hover:bg-blue-500 hover:text-white'>
          <b>CONVENIENCE:</b>
          <p>Access to a network of trusted healthcare professionals in your area.</p>
        </div>
        <div className='border cursor-pointer text-[15px] py-14 px-10 md:px16 md:py-16 flex flex-col  text-gray-700 gap-5 hover:bg-blue-500 hover:text-white'>
          <b>PERSONALIZATION:</b>
          <p>Tailored recommendations and reminders to help you stay on top of your health.</p>
        </div>
      </div>
    </div>
  )
}

export default About
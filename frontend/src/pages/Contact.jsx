
import { assets } from '../assets/assets'

const Contact = () => {
  return (
    <div>
      <p className='text-2xl font-medium text-center my-10 text-gray-500'>CONTACT <span className='text-black'>US</span></p>
      <div className='sm:w-[40rem] flex flex-col sm:flex-row mx-auto pt-5 gap-10'>
        <img className='w-auto sm:max-w-xs rounded-lg' src={assets.contact_image} />
        <div>
          <b className='text-gray-800'>OUR OFFICE</b>
          <div className='mt-6 text-gray-500 text-sm'>
          <p>00000 Willms Station</p>
          <p>XYZ, Lucknow, 226021</p>
          </div>
          <div className='mt-5 text-gray-500 text-sm'>
          <p>Tel: (000) 000-0000</p>
          <p>Email: mediquick@gmail.com</p>
          </div>
          <p className='my-6 font-semibold text-gray-800'>CAREERS AT PRESCRIPTO</p>
          <p className='text-gray-500 text-sm'>Learn more about our teams and job openings.</p>
          <button className='mt-4 border px-6 text-sm border-black hover:bg-black hover:text-white duration-500 py-3'>Explore Jobs
          </button>
        </div>
      </div>
    </div>
  )
}

export default Contact
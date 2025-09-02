import { assets } from "../assets/assets"

const Banner = () => {
  return (
    <div className="flex px-10 my-10 border border-gray-400 rounded-lg bg-blue-500 w-full h-[15rem] sm:h-[24rem] justify-between text-white">
        <div className="w-1/2 max-sm:w-full flex flex-col justify-center items-center">
            <p className="text-3xl md:text-4xl lg:text-5xl font-semibold leading-tight max-sm:text-center">Book Appintment <br /> with 100+ Trusted <br /> Doctors</p>
            <button className="px-5 py-2 border border-gray-400 w-fit rounded-full my-5 bg-white text-gray-500">Create account</button>
        </div>
        <div className="w-1/2 hidden sm:block">
            <img className="h-full" src={assets.appointment_img} />
        </div>
    </div>
  )
}

export default Banner
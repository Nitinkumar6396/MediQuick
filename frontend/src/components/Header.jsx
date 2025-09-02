import { assets } from "../assets/assets"

const Header = () => {
    return (
        <div className="md:h-[370px] lg:h-[480px] flex text-white justify-between px-16 bg-blue-500 mt-6 rounded-lg flex-col md:flex-row">
            <div className="md:h-full flex flex-col justify-center  md:w-1/2 m-auto my-10 md:my-0">
                <p className="text-3xl lg:text-5xl font-semibold max-md:text-center">Book Appointment <br /> With Trusted Doctors</p>
                <div className="flex flex-col md:flex-row items-center max-md:text-center my-5 gap-2">
                    <img className="h-12 w-30" src={assets.group_profiles} />
                    <div className="text-[14px] leading-tight">
                        <p>Simply browse through our extensive list of trusted doctors,</p>
                        <p>schedule your appointment hassle-free.</p>
                    </div>
                </div>
                <div className="flex items-center max-md:m-auto w-fit px-8 py-2 rounded-full border border-black bg-white text-black">
                    <a href="#speciality" className="flex gap-2 w-fit">Book Appointment {<img className="w-3" src={assets.arrow_icon}/>}</a>
                </div>
                
            </div>

            <div className="h-full flex items-end md:w-[56%]">
                <img className="h-auto" src={assets.header_img} alt="header image" />
            </div>
        </div>
    )
}

export default Header
import { Link } from "react-router-dom"
import { specialityData } from "../assets/assets"

const SpecialityMenu = () => {
  return (
    <div id="speciality" className="flex flex-col items-center text-center py-14">
        <h1 className="text-3xl font-medium">Find by Speciality</h1>
        <p className="w-2/5 py-4 text-sm">Simply browse through our extensive list of trusted doctors, schedule your appointment hassle-free.</p>
        <div className="flex min-[860px]:justify-center items-start w-full gap-4 text-center py-8 overflow-scroll no-scrollbar">
            {
                specialityData.map((item,index) => (
                    <Link 
                    className="flex flex-col gap-2 flex-shrink-0 hover:translate-y-[-10px] transition-all duration-500 items-center"
                    to={`/doctors/${item.speciality}`} 
                    onClick={() => scrollTo(0, 0)}
                    key={index} >
                        <img className="w-16 sm:w-24" src={item.image} />
                        <p className="text-xs">{item.speciality}</p>
                    </Link>
                ))
            }
        </div>
    </div>
  )
}

export default SpecialityMenu
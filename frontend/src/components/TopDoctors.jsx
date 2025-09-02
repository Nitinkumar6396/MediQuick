import { useContext } from "react";
import { useNavigate } from "react-router-dom"
import { AppContext } from "../context/AppContext";
// import { doctors } from "../assets/assets"

const TopDoctors = () => {

    const { doctors } = useContext(AppContext)

    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center text-center gap-4 px-10  ">
            <p className="text-3xl font-medium">Top Doctors to Book</p>
            <p className="text-sm w-1/3 ">Simply browse through our extensive list of trusted doctors.</p>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(215px,1fr))] gap-4 pt-5 w-full">
                {
                    doctors.slice(0, 10).map((item, index) => (
                        <div
                            onClick={() => navigate(`/appointment/${item._id}`)}
                            className="border border-gray-300 rounded-lg text-start cursor-pointer hover:-translate-y-[10px] duration-500" key={index} >
                            <img className="bg-blue-50 rounded-lg w-full" src={item.image} />
                            <div className="p-3 flex flex-col">
                                <div className="flex items-center gap-2 text-green-500">
                                    <p className={`w-2 h-2 rounded-full ${item.available ? "bg-green-500" : "bg-red-500"}`}></p>
                                    <p className={`text-sm ${item.available ? "text-green-500" : "text-red-500"}`}>{item.available ? "Available" : "Not Available"}</p>
                                </div>
                                <p className="text-lg font-semibold">{item.name}</p>
                                <p className="text-sm text-gray-500">{item.speciality}</p>
                            </div>
                        </div>
                    ))
                }
            </div>
            <button onClick={() => { navigate('/doctors'); scrollTo(0, 0) }} className="py-2 px-9 my-10 border border-gray-300 rounded-full bg-blue-100">more</button>
        </div>
    )
}

export default TopDoctors
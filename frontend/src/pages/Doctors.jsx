import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const Doctors = () => {
  const { doctors } = useContext(AppContext);
  const { speciality } = useParams();
  const [filDoc, setFilDoc] = useState([]);
  const [filter, setFilter] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (speciality) {
      setFilDoc(doctors.filter((doc) => doc.speciality === speciality));
    } else {
      setFilDoc(doctors);
    }
  }, [speciality, doctors]);

  return (
    <div>
      <p className="pt-5 text-gray-600">Browse through the doctors specialist.</p>

      <button
        onClick={() => setFilter(!filter)}
        className={`border sm:hidden border-gray-300 px-4 py-1 mt-2 text-sm rounded-lg ${filter ? "bg-blue-500 text-white" : ""
          }`}
      >
        Filters
      </button>

      <div className="flex items-center justify-center flex-wrap my-5 gap-4">
        {[
          "General physician",
          "Gynecologist",
          "Dermatologist",
          "Pediatricians",
          "Neurologist",
          "Gastroenterologist",
        ].map((spec, i) => (
          <p
            key={i}
            onClick={() =>
              speciality === spec ? navigate("/doctors") : navigate(`/doctors/${spec}`)
            }
            className={`${!filter ? "max-sm:hidden" : ""} max-sm:w-full max-sm:text-center px-4 py-2 rounded-full text-sm cursor-pointer hover:bg-blue-200 ${speciality === spec ? "bg-blue-500 text-white" : "bg-blue-100 text-blue-700"
              }`}
          >
            {spec}
          </p>
        ))}
      </div>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(215px,1fr))] gap-4 pt-5 w-full">
        {filDoc.length > 0 ? (
          filDoc.map((item) => (
            <div
              key={item._id}
              onClick={() => navigate(`/appointment/${item._id}`)}
              className="border border-gray-300 rounded-lg text-start cursor-pointer hover:-translate-y-[10px] duration-500"
            >
              <img className="bg-blue-50 rounded-lg w-full" src={item.image} alt={item.name} />
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
        ) : (
          <p className="text-center text-gray-400 col-span-full">No doctors found.</p>
        )}
      </div>
    </div>
  );
};

export default Doctors;

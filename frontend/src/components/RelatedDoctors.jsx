import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const RelatedDoctors = ({ DocId, speciality }) => {
  const navigate = useNavigate();

  const { doctors } = useContext(AppContext)

  const RelDoc = doctors.filter(
    (doc) => doc.speciality === speciality && doc._id !== DocId
  );

  return (
    <div className="mt-16">
      <h1 className="text-3xl font-medium text-center">Related Doctors</h1>
      <p className="text-sm text-center sm:w-1/3 mx-auto my-4">
        Simply browse through our extensive list of trusted doctors.
      </p>

      {RelDoc.length === 0 ? (
        <p className="text-center text-gray-500 mt-4">
          No related doctors found.
        </p>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(215px,1fr))] gap-4 pt-5 w-full">
          {RelDoc.slice(0, 5).map((item) => (
            <div
              role="button"
              onClick={() => {
                navigate(`/appointment/${item._id}`);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="border border-gray-300 rounded-lg text-start cursor-pointer hover:-translate-y-[10px] duration-500"
              key={item._id}
            >
              <img
                className="bg-blue-50 rounded-lg w-full"
                src={item.image}
                alt={item.name}
              />
              <div className="p-3 flex flex-col">
                <div className="flex items-center gap-2 text-green-500">
                  <p className={`w-2 h-2 rounded-full ${item.available ? "bg-green-500" : "bg-red-500"}`}></p>
                  <p className={`text-sm ${item.available ? "text-green-500" : "text-red-500"}`}>{item.available ? "Available" : "Not Available"}</p>
                </div>
                <p className="text-lg font-semibold">{item.name}</p>
                <p className="text-sm text-gray-500">{item.speciality}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RelatedDoctors;

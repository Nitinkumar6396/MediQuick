import { useNavigate, useParams } from "react-router-dom";
import { assets } from "../assets/assets";
import { useContext, useEffect, useState } from "react";
import RelatedDoctors from "../components/RelatedDoctors";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import axios from "axios";

const Appointment = () => {
  const { doctors, fetchDoctors, token, backendUrl } = useContext(AppContext);
  const { DocId } = useParams();
  const navigate = useNavigate();

  const [docSlots, setDocSlots] = useState([]);
  const [slotIndex, setSlotIndex] = useState(0);
  const [slotTime, setSlotTime] = useState("");

  const docInfo = doctors.find((doc) => doc._id === DocId);
  const dayOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  useEffect(() => {
    fetchDoctors();
  }, []);

  useEffect(() => {
    if (docInfo) getAvailableSlots();
  }, [docInfo]);

  const getAvailableSlots = async () => {
    setDocSlots([]);
    const today = new Date();

    for (let i = 0; i < 7; i++) {
      const currDate = new Date(today);
      currDate.setDate(today.getDate() + i);

      const endTime = new Date(currDate);
      endTime.setHours(21, 0, 0, 0);

      if (i === 0) {
        currDate.setHours(currDate.getHours() > 10 ? currDate.getHours() + 1 : 10);
        currDate.setMinutes(currDate.getMinutes() > 30 ? 30 : 0);
      } else {
        currDate.setHours(10);
        currDate.setMinutes(0);
      }

      const timeSlots = [];
      while (currDate < endTime) {
        const formattedTime = currDate.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });

        const day = String(currDate.getDate()).padStart(2, "0");
        const month = String(currDate.getMonth() + 1).padStart(2, "0");
        const year = currDate.getFullYear();
        const slotDate = `${day}-${month}-${year}`;
        const slotTime = formattedTime;

        const isSlotAvailable =
          !docInfo.slots_booked[slotDate] ||
          !docInfo.slots_booked[slotDate].includes(slotTime);

        if (isSlotAvailable) {
          timeSlots.push({
            datetime: new Date(currDate),
            time: formattedTime,
          });
        }

        currDate.setMinutes(currDate.getMinutes() + 30);
      }

      setDocSlots((prev) => [...prev, timeSlots]);
    }
  };

  const bookAppointment = async () => {
    if (!token) {
      toast.warn("Login to book appointment");
      return navigate("/login");
    }

    if (!slotTime) {
      toast.warn("Please select a slot time");
      return;
    }

    try {
      const date = docSlots[slotIndex][0].datetime;
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      const slotDate = `${day}-${month}-${year}`;

      const { data } = await axios.post(
        `${backendUrl}/api/user/book-appointment`,
        { slotDate, slotTime, docId: DocId },
        { headers: { token } }
      );

      if (data.success) {
        toast.success(data.message);
        fetchDoctors();
        navigate("/my-appointments");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  if (!docInfo) {
    return <div className="text-center text-red-500 mt-10">Doctor not found.</div>;
  }

  return (
    <div className="flex my-5 flex-col">
      {/* Doctor Info */}
      <div className="flex flex-col sm:flex-row">
        <div>
          <img
            className="max-sm:w-full sm:max-w-72 bg-blue-500 rounded-lg"
            src={docInfo.image}
            alt="doctor"
          />
        </div>
        <div className="border border-gray-400 w-[97%] mx-auto rounded-lg p-7 max-sm:relative max-sm:top-[-60px] bg-white sm:ml-5">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-medium">{docInfo.name}</h1>
            <img className="w-5" src={assets.verified_icon} />
          </div>
          <div className="flex gap-2 text-gray-600 py-2">
            <p>{docInfo.degree} - {docInfo.speciality}</p>
            <button className="text-xs border px-2 rounded-full">
              {docInfo.experience}
            </button>
          </div>
          <div className="flex gap-1 items-center py-1">
            <p className="text-sm font-medium text-gray-900">About</p>
            <img className="w-3" src={assets.info_icon} />
          </div>
          <p className="text-sm text-gray-600">{docInfo.about}</p>
          <div className="flex gap-1 mt-4 text-lg font-medium">
            <p className="text-gray-700">Appointment fee:</p>
            <p>{`$${docInfo.fees}`}</p>
          </div>
        </div>
      </div>

      {/* Slot Selection */}
      <div className="sm:ml-[308px] mt-6">
        <p>Booking slots</p>
        {/* Date Picker */}
        <div className="flex gap-3 my-5 overflow-x-scroll no-scrollbar">
          {docSlots.map((item, index) =>
            item.length > 0 && (
              <div
                key={index}
                onClick={() => {
                  setSlotIndex(index);
                  setSlotTime("");
                }}
                className={`cursor-pointer border w-16 rounded-full py-5 text-center flex flex-col flex-shrink-0 border-gray-300 ${
                  index === slotIndex ? "bg-blue-500 text-white" : ""
                }`}
              >
                <p>{dayOfWeek[item[0].datetime.getDay()]}</p>
                <p>{item[0].datetime.getDate()}</p>
              </div>
            )
          )}
        </div>

        {/* Time Slots */}
        {Array.isArray(docSlots[slotIndex]) && docSlots[slotIndex].length > 0 ? (
          <div className="flex flex-shrink-0 gap-5 overflow-x-scroll no-scrollbar">
            {docSlots[slotIndex].map((item, index) => (
              <div
                key={index}
                onClick={() => setSlotTime(item.time)}
                className={`border border-gray-300 cursor-pointer rounded-full text-gray-500 text-nowrap px-5 text-center py-2 text-sm ${
                  item.time === slotTime ? "bg-blue-500 text-white" : ""
                }`}
              >
                {item.time.toLowerCase()}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-red-500 mt-2">No slots available on this day.</p>
        )}

        <button
          onClick={bookAppointment}
          className="px-16 text-white py-3 text-sm bg-blue-500 rounded-full my-5"
        >
          Book an appointment
        </button>
      </div>

      {/* Related Doctors */}
      <RelatedDoctors DocId={DocId} speciality={docInfo.speciality} />
    </div>
  );
};

export default Appointment;

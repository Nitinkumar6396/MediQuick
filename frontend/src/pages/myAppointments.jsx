import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import Swal from "sweetalert2";


const MyAppointments = () => {
  const { token, backendUrl } = useContext(AppContext);
  const [appointments, setAppointments] = useState([]);
  const navigate = useNavigate();

  const getUserAppointments = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/appointments`, {
        headers: { token },
      });
      if (data.success) {
        setAppointments(data.appointments);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    getUserAppointments();
  }, []);

  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/user/cancel-appointment`,
        { appointmentId },
        { headers: { token } }
      );
      if (data.success) {
        toast.success("Appointment cancelled");
        getUserAppointments();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const handleCancel = (appointmentId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to cancel this appointment?",
      icon: "warning",
      showCancelButton: true,
      cancelButtonText: "No, keep it",
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, cancel it!",
    }).then((result) => {
      if (result.isConfirmed) {
        cancelAppointment(appointmentId);
        Swal.fire("Cancelled!", "Your appointment has been cancelled.", "success");
      }
    });
  };

  const initPay = (order) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: "MediQuick",
      description: "Doctor Appointment Payment",
      order_id: order.id,
      handler: async (res) => {
        try {
          const { data } = await axios.post(
            `${backendUrl}/api/user/verifyPayment`,
            {
              razorpay_order_id: res.razorpay_order_id,
              razorpay_payment_id: res.razorpay_payment_id,
              razorpay_signature: res.razorpay_signature,
              appointmentId: order.receipt
            },
            { headers: { token } }
          );
          if (data.success) {
            toast.success(data.message);
            getUserAppointments();
            navigate("/my-appointments");
          } else {
            toast.error(data.message);
          }
        } catch (error) {
          console.log(error);
          toast.error(error.message);
        }
      },
    };

    const razor = new window.Razorpay(options);
    razor.open();
  };

  const appointmentRazorpay = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/user/payment-razorpay`,
        { appointmentId },
        { headers: { token } }
      );

      if (data.success) {
        initPay(data.order);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto my-8 px-4">
      <h1 className="text-xl sm:text-2xl font-semibold mb-6 text-center sm:text-left">
        My Appointments
      </h1>

      <div className="space-y-6">
        {appointments.length > 0 ? (
          appointments.map((item, index) => (
            <div key={index} className="p-4 border rounded-lg shadow-md bg-white">
              <div className="flex flex-col sm:flex-row sm:items-end gap-4">
                <img
                  src={item.docData.image}
                  alt={item.docData.name}
                  className="w-full sm:w-28 h-auto bg-blue-200 rounded-md object-cover"
                />

                <div className="flex-1">
                  <h2 className="text-lg font-medium">{item.docData.name}</h2>
                  <p className="text-sm text-gray-600">{item.docData.speciality}</p>
                  <div className="text-sm text-gray-600 mt-1">
                    <strong>Address:</strong>
                    <div>
                      {item.docData.address.line1}
                      <br />
                      {item.docData.address.line2}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    <strong>Date & Time:</strong> {item.slotDate} | {item.slotTime}
                  </p>
                </div>

                <div className="flex sm:flex-col gap-2 mt-4 sm:mt-0">
                  {
                    item.isCompleted
                      ? <button
                        disabled
                        className="px-4 py-1 w-full border border-green-500 text-black rounded-md bg-slate-100">Completed</button>

                      : item.payment
                        ? <button
                          disabled
                          className="px-4 py-1 w-full border border-green-500 text-black rounded-md bg-slate-100">Paid</button>
                        : <button
                          onClick={() => appointmentRazorpay(item._id)}
                          className="px-4 py-1 w-full border border-gray-400 text-black rounded-md hover:bg-blue-500 hover:text-white transition-all duration-300">Pay Online</button>
                  }

                  {
                    !item.isCompleted && !item.payment && <button
                      onClick={() => handleCancel(item._id)}
                      className="px-4 py-1 w-full border border-gray-400 text-black rounded-md hover:bg-red-500 hover:text-white transition-all duration-300">Cancel</button>
                  }

                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center">No appointments available.</p>
        )}
      </div>

      <div className="text-center">
        <button
          onClick={() => {
            navigate("/doctors");
            scrollTo(0, 0);
          }}
          className="mt-6 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-all"
        >
          Add Appointment
        </button>
      </div>
    </div>
  );
};

export default MyAppointments;

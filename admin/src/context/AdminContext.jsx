import { createContext, useState } from "react";
import axios from 'axios';
import { toast } from 'react-toastify';

export const AdminContext = createContext();

const AdminContextProvider = (props) => {
  const [aToken, setAToken] = useState(localStorage.getItem("aToken") || "");
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([])
  const [dashData, setDashData] = useState(false)


  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const getAllDoctors = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/admin/all-doctors`, {
        headers: { token: aToken }
      });

      if (data.success) {
        setDoctors(data.data);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Something went wrong");
      }
    }
  };

  const changeAvailability = async (docId) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/admin/change-availability`,
        { docId },
        { headers: { token: aToken } }
      );

      if (data.success) {
        toast.success(data.message);
        getAllDoctors();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      if (error.response.data.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Something went wrong");
      }
    }
  };

  const getAllAppointments = async () => {
    try {

      const { data } = await axios.get(`${backendUrl}/api/admin/appointments`, { headers: { token: aToken } })
      if (data.success) {
        setAppointments(data.appointments)
      }
      else{
        toast.error(data.message)
      }

    } catch (error) {
      console.log(error);
      if (error.response.data.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Something went wrong");
      }
    }

  }

  const getDashData = async (tok = aToken)=>{
    try{

      const {data} = await axios.get(`${backendUrl}/api/admin/dashboard`,{headers:{token:tok}})
      if(data.success) setDashData(data.dashData)
      else toast.error(data.message)

    }
    catch (error) {
      console.log(error);
      if (error.response.data.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Something went wrong");
      }
    }
  }

  const value = {
    aToken,
    setAToken,
    backendUrl,
    doctors,
    getAllDoctors,
    changeAvailability,appointments, getAllAppointments,getDashData,dashData
  };

  return (
    <AdminContext.Provider value={value}>
      {props.children}
    </AdminContext.Provider>
  );
};

export default AdminContextProvider;

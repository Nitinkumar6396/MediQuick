import axios from "axios";
import { useState } from "react";
import { createContext } from "react";
import { toast } from "react-toastify";

export const doctorContext = createContext()

const DoctorContextProvider = (props) => {

    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const [dToken, setDToken] = useState(localStorage.getItem("dToken") || "")
    const [appointments, setAppointments] = useState([])
    const [dashData, setDashData] = useState(false)
    const [profileData, setProfileData] = useState('')

    const getAppointments = async () => {
        try {
            const {data} = await axios.get(backendUrl + '/api/doctor/appointments', {headers:{token:dToken}})
            if(data.success){
                setAppointments(data.appointments.reverse())
            }
            else{
                toast.error(data.message)
            }
        }
        catch (error) {
            console.log(error);
            if (error.response?.data?.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error("Something went wrong");
            }
        }
    }

    const getDashData = async ()=> {
        try{
            const {data} = await axios.get(backendUrl + '/api/doctor/dashboard' ,{headers:{token:dToken}})
            if(data.success){
                setDashData(data.dashData)
            }
            else {
                toast.error(data.message)
            }
        }
        catch (error) {
            console.log(error);
            if (error.response?.data?.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error("Something went wrong");
            }
        }
    }

    const getProfileData = async () => {
        try{
            const {data} = await axios.get(backendUrl + '/api/doctor/profile',{headers:{token:dToken}})
            if(data.success){
                setProfileData(data.doctorData)
            }
            else{
                toast.error(data.message)
            }
        }
        catch (error) {
            console.log(error);
            if (error.response?.data?.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error("Something went wrong");
            }
        }
    }

    const value = {
        backendUrl, dToken, setDToken,getAppointments,appointments,
        dashData, setDashData, getDashData,
        getProfileData, profileData,setProfileData
    }
    return <doctorContext.Provider value={value}>
        {props.children}
    </doctorContext.Provider>
}

export default DoctorContextProvider
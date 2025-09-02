import { createContext, useState } from "react";
import axios from 'axios';
import { toast } from "react-toastify";
import { useEffect } from "react";

// Create context
export const AppContext = createContext();

const AppContextProvider = (props) => {
    const [doctors, setDoctors] = useState([]);
    const [token,setToken] = useState(localStorage.getItem('token') || '')
    const currencySymbol = "$";
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [userData,setUserData] = useState(false)

    const fetchDoctors = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/doctor/list`);

            if (data.success) {
                setDoctors(data.data);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response.data.message || "Something went wrong");
        }
    };

    const fetchUserData = async (Token = token) => {
        try {
            const {data} = await axios.get(`${backendUrl}/api/user/get-profile`,{headers:{token:Token}})
            if(data.success){
                setUserData(data.userData)
            }
            else{
                toast.error(data.message)
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response.data.message || "Something went wrong");
        }
    }

    useEffect(() => {
        fetchDoctors()
    },[])

    useEffect(() => {
        if(token) fetchUserData()
    }, [token]);


    return (
        <AppContext.Provider
            value={{
                doctors,
                fetchDoctors,
                currencySymbol,
                token,setToken,backendUrl,userData,setUserData,fetchUserData
            }}
        >
            {props.children}
        </AppContext.Provider>
    );
};

export default AppContextProvider;

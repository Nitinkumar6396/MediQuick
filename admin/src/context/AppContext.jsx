import { createContext, useState } from "react";

export const AppContext = createContext();

const AppContextProvider = (props) => {
  
  const calculateAge = (dob) => {
    const today = new Date();
    console.log(today, "   " , dob)
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    return age;
  };

  const [state, setState] = useState('Admin')

  const currency = import.meta.env.VITE_CURRENCY 

  const value = {
    calculateAge,
    currency,state,setState
  };

  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;

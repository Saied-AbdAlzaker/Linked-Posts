import { addToast } from "@heroui/toast";
import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const authContext = createContext();

export default function AuthContextProvider({ children }) {
    const [token, setToken] = useState(localStorage.getItem("userToken"));
    const [userData, setUserData] = useState(null)

    function getUserData() {
        axios.get(`https://route-posts.routemisr.com/users/profile-data`, {
            headers: {
                token
            }
        }).then(({ data }) => {
            setUserData(data.data.user);
        }).catch((err) => {
            setToken(null);
            localStorage.removeItem("userToken");
            addToast({
                title: "Error",
                description: err.message,
                color: "error",
            })
        })
    }

    useEffect(() => {
        if (token) {
            getUserData();
        }
    }, [token])

    return <authContext.Provider value={{ token, setToken, userData, setUserData }}>
        {children}
    </authContext.Provider>
}
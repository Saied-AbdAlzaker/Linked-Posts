import { useContext } from "react"
import { authContext } from "../../Context/AuthContext"
import { Navigate } from "react-router-dom";
import LoadingSpinner from './../Loading/LoadingSpinner';


export default function ProutectedRoute({ children }) {
    const { token, userData } = useContext(authContext);

    return <>
        {/* {token ? children : <Navigate to={'/auth/login'} />} */}
        {token ? (userData ? children : <LoadingSpinner />) : <Navigate to={'/auth/login'} />}
    </>
}

import { useContext } from "react"
import { authContext } from "../../Context/AuthContext"
import { Navigate } from 'react-router-dom';

export default function AuthProtectedRoute({ children }) {
    const { token } = useContext(authContext);

    return <>
        {token ? <Navigate to={'/'} /> : children}
    </>
}

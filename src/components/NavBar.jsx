import { useContext } from "react";
import { authContext } from "../Context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { Navbar as HeroNavbar, Button, NavbarBrand, NavbarContent, NavbarItem, Avatar } from "@heroui/react";

export default function NavBar() {
    const { token, setToken, userData } = useContext(authContext)
    const navigate = useNavigate();

    function logout() {
        setToken(null);
        localStorage.removeItem("userToken");
        navigate("/auth/login");
    }

    return <>
        <HeroNavbar className='bg-slate-200 fixed'>
            <NavbarBrand>
                <Link className="font-bold text-inherit" to={'/'}>Linked Posts</Link>
            </NavbarBrand>
            <NavbarContent justify="end">
                {token && <>
                    {userData && <NavbarItem>
                        <Link color="foreground" to={'/profile'}>
                            <div className="flex justify-center items-center gap-2">
                                <Avatar isBordered color="primary" src={userData.photo} />
                                <p>{userData.name}</p>
                            </div>
                        </Link>
                    </NavbarItem>}

                    <NavbarItem>
                        <Button onPress={logout} color="primary" variant="flat">
                            SignOut
                        </Button>
                    </NavbarItem>


                </>
                }
            </NavbarContent>
        </HeroNavbar>
    </>
}

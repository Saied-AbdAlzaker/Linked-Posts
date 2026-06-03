import { useContext, useEffect, useState } from "react";
import { authContext } from "../Context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { Navbar as HeroNavbar, Button, NavbarBrand, NavbarContent, NavbarItem, Avatar } from "@heroui/react";

export default function NavBar() {
    const { token, setToken, userData } = useContext(authContext)
    const navigate = useNavigate();
    const [theme, setTheme] = useState(null);

    function logout() {
        setToken(null);
        localStorage.removeItem("userToken");
        navigate("/auth/login");
    }

    // DarkMode
    useEffect(() => {
        if (!("theme" in localStorage)) {
            if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
                document.documentElement.classList.add("dark")
                setTheme("dark")
            } else if (window.matchMedia("(prefers-color-scheme: light)").matches) {
                setTheme("light")
            }
        }

        if (("theme" in localStorage)) {
            if (localStorage.getItem("theme") == "dark") {
                document.documentElement.classList.add("dark");
                setTheme("dark");
            } else if (localStorage.getItem("theme") == "light") {
                setTheme("light");
            }
        }

    }, [])

    function toggleMode() {
        document.documentElement.classList.toggle("dark")
        if (theme == "dark") {
            localStorage.setItem("theme", "light")
            setTheme("light")
        } else {
            localStorage.setItem("theme", "dark")
            setTheme("dark")
        }
    }

    return <>
        <HeroNavbar className='bg-slate-200 fixed dark:bg-gray-800'>
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
                    {/* DarkMode */}
                    <button onClick={toggleMode}
                        className="h-12 w-12 rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                        <svg className="fill-violet-700 block dark:hidden" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path>
                        </svg>
                        <svg className="fill-yellow-500 hidden dark:block" fill="currentColor" viewBox="0 0 20 20">
                            <path
                                d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                                fill-rule="evenodd" clip-rule="evenodd"></path>
                        </svg>
                    </button>

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

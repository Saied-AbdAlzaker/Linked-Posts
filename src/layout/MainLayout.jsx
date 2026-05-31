import { Outlet } from "react-router-dom";
import NavBar from "../components/Navbar";

export default function MainLayout() {
  return <>
    <NavBar />
    <div className="container mx-auto mt-20">
      <Outlet />
    </div>
  </>
}

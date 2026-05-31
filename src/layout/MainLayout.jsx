import { Outlet } from "react-router-dom";
import NavBar from "../components/NavBar";

export default function MainLayout() {
  return <>
    <NavBar />
    <div className="container mx-auto mt-20">
      <Outlet />
    </div>
  </>
}

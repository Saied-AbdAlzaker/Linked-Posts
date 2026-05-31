import { Button, Input } from "@heroui/react";
import { addToast } from "@heroui/toast";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { loginSchema } from "../schemas/loginSchema";
import { authContext } from "../Context/AuthContext";

export default function Login() {
  const [errorMeesage, setErrorMeesage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { setToken } = useContext(authContext)
  const navigate = useNavigate();

  const { handleSubmit, register, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema)
  })

  function submitForm(formData) {
    setIsLoading(true);
    setErrorMeesage("")
    axios.post(`https://route-posts.routemisr.com/users/signin`, formData).then(({ data }) => {
      addToast({
        title: "Success",
        description: data.message,
        color: "success",
      })
      localStorage.setItem("userToken", data.data.token)
      setToken(data.data.token)
      navigate("/")
    }).catch((err) => {
      if (err.code === "ERR_NETWORK") {
        setErrorMeesage("Network Error, check internet connection.");
        addToast({
          title: "Error",
          description: err.message,
          color: "error",
        })
      } else {
        setErrorMeesage(err.response.data.message);
          addToast({
          title: "Error",
          description: err.response.data.message,
          color: "error",
        })
      }
    }).finally(() => {
      setIsLoading(false);
    })
  }


  function inputAttributes(label = "", type = "") {
    return {
      classNames: { label: "text-white", innerWrapper: "#fff" },
      label: label,
      type: type,
      variant: "bordered"
    }
  }
  return <div>
    <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">
      Welcome back
    </h2>

    <p className="text-center text-gray-100 mb-6">
      Log in and continue your social.
    </p>

    <form onSubmit={handleSubmit(submitForm)} className="space-y-5">

      {/* Email */}
      <div>
        <Input {...inputAttributes("Email", "email")} {...register("email")}
          isInvalid={!!errors.email?.message}
          errors={errors.email?.message} />
        <p className="text-red-700">{errors.email?.message}</p>
      </div>

      {/* Password */}
      <div>
        <Input {...inputAttributes("Password", "password")} {...register("password")}
          isInvalid={!!errors.password?.message}
          errors={errors.password?.message} />
        <p className="text-red-700">{errors.password?.message}</p>
      </div>

      {/* Button */}
      <Button type="submit" isLoading={isLoading} className="w-full text-white" variant="bordered">Login</Button>
      {errorMeesage && <p className="text-red-700 text-center">{errorMeesage}</p>}
      <p className="text-center">Create new account? <Link className="underline text-white" to={"/auth/register"}>Register</Link></p>
    </form>
  </div>
}
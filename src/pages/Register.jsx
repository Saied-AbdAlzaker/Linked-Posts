import { addToast, Button, Input, Select, SelectItem } from "@heroui/react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "../schemas/registerSchema.js";
import axios from "axios";
import { useState } from "react";

export default function Register() {

    const [errorMeesage, setErrorMeesage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const { handleSubmit, register, formState: { errors } } = useForm({
        defaultValues: {
            name: '',
            email: '',
            password: '',
            rePassword: '',
            dateOfBirth: '',
            gender: ''
        },
        resolver: zodResolver(registerSchema)
    })

    function submitForm(formData) {
        setIsLoading(true);
        setErrorMeesage("")
        axios.post(`https://route-posts.routemisr.com/users/signup`, formData).then((res) => {
            addToast({
                title: "Success",
                description: res.data.message,
                color: "success",
            })
            navigate("/auth/login")
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
            Create Account
        </h2>

        <p className="text-center text-gray-100 mb-6">
            Register your new account
        </p>

        <form onSubmit={handleSubmit(submitForm)} className="space-y-5">

            {/* Username */}
            <div>
                <Input  {...inputAttributes("User Name", "text")} {...register("name")}
                    isInvalid={!!errors.name?.message}
                    errors={errors.name?.message} />
                <p className="text-red-700">{errors.name?.message}</p>
            </div>

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

            {/* Confirm Password */}
            <div>
                <Input {...inputAttributes("Confirm Password", "password")} {...register("rePassword")}
                    isInvalid={!!errors.rePassword?.message}
                    errors={errors.rePassword?.message} />
                <p className="text-red-700">{errors.rePassword?.message}</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
                {/* Gender */}
                <div>
                    <Select onClick={(e) => e.preventDefault()} className="max-w-md" {...inputAttributes("Select Gender", "email")}
                        {...register("gender")}
                        isInvalid={!!errors.gender?.message}
                        errors={errors.gender?.message}>
                        <SelectItem key={"male"}>Male</SelectItem>
                        <SelectItem key={"female"}>Female</SelectItem>
                    </Select>
                    <p className="text-red-700">{errors.gender?.message}</p>
                </div>

                {/* Date of Birth */}
                <div>
                    <Input {...inputAttributes("Date Of Birth", "date")} {...register("dateOfBirth")}
                        isInvalid={!!errors.dateOfBirth?.message}
                        errors={errors.dateOfBirth?.message} />
                    <p className="text-red-700">{errors.dateOfBirth?.message}</p>
                </div>
            </div>

            {/* Button */}
            <Button type="submit" isLoading={isLoading} className="w-full text-white" variant="bordered">Register</Button>
            {errorMeesage && <p className="text-red-700 text-center">{errorMeesage}</p>}
            <p className="text-center">Already have an account? <Link className="underline text-white" to={"/auth/login"}>Login</Link></p>
        </form>
    </div>
}

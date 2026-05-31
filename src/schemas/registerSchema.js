import * as zod from "zod";
import { intervalToDuration } from "./../../node_modules/date-fns/fp/intervalToDuration";

export const registerSchema = zod
  .object({
    name: zod
      .string()
      .nonempty("Name is required.")
      .min(3, "Name must be at least 3 characters.")
      .max(30, "Name cannot be longer than 30 characters."),
    email: zod
      .string()
      .nonempty("Email is required.")
      .regex(
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Please enter a valid email address.",
      ),
    dateOfBirth: zod.coerce
      .date("Date must be in DD-MM-YYYY Fomate.")
      .refine((date) => {
        const age = intervalToDuration({
          start: date,
          end: Date.now(),
        });
        return age.years >= 18;
      }, "Your age lessthan 18"),
    gender: zod.enum(["male", "female"], {
      error: "Please select a valid gender.",
    }),
    password: zod
      .string()
      .nonempty("Password is required")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        "Password must include uppercase, lowercase, number, and special character",
      ),
    rePassword: zod.string().nonempty("Confirm Password is required"),
  })
  .refine(
    (data) => {
      return data.password === data.rePassword;
    },
    {
      error: "Password and Confirm password must be matched",
      path: ["rePassword"],
    },
  );

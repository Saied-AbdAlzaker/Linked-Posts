import * as zod from "zod";

export const loginSchema = zod.object({
  email: zod
    .string()
    .nonempty("Email is required.")
    .regex(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Please enter a valid email address.",
    ),
  password: zod
    .string()
    .nonempty("Password is required")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      "Password must include uppercase, lowercase, number, and special character",
    ),
});

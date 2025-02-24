import { z } from "zod";
import { passwordValidation } from "./signUpSchema";

export const setPasswordSchema = z.object({
  password: passwordValidation,
  confirmPassword: passwordValidation,
});

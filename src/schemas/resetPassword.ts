import { emailValidation } from "./signUpSchema";
import { z } from "zod";

export const resetPasswordSchema = z.object({
  email: emailValidation,
});

import z from "zod";

export const signInSchema = z.object({
    identifier: z.string(), // it can be email or username
    password: z.string()
})
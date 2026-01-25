import * as z from 'zod'


export const SignupFormSchema = z.object({
    firstName: z
        .string()
        .min(2, { error: 'firstName must be at least 2 characters long.' })
        .trim(),
    lastName: z
        .string()
        .min(2, { error: 'lastName must be at least 2 characters long.' })
        .trim(),
    email: z.email({ error: 'Please enter a valid email.' }).trim(),
    password: z
        .string()
        .min(3, { error: 'Be at least 3 characters long' })
        .regex(/[a-zA-Z]/, { error: 'Contain at least one letter.' })
        .regex(/[0-9]/, { error: 'Contain at least one number.' })
        .trim(),
})
 

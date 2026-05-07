import z from 'zod'

export const registerSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters long").max(50),
    email: z.email("Invalid email address").max(64),
    password: z.string()
        .min(8, "Password must be at least 8 characters long")
        .regex(/\d/, "Password must contain at least one number")
        .regex(/[!@#$%^&*()_\-+=[\]{};':"\\|,.<>/?`~]/, "Password must contain at least one special character")
        .max(128),

    taxId: z.string()
        .length(8, "Tax ID must be 8 characters long")
        .regex(/^\d{8}$/, "Tax ID must contain only numbers"),
});
export const loginSchema = z.object({
    email: z.email("Invalid email address").max(64),
    password: z.string().min(8, "Password must be at least 8 characters long").max(128),
});

export type RegisterSchema = z.infer<typeof registerSchema>;
export type LoginSchema = z.infer<typeof loginSchema>;

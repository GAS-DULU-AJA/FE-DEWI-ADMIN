import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().min(1, "emailRequired").email("emailInvalid"),
  password: z.string().min(1, "passwordRequired").min(8, "passwordMin"),
});

export const registerSchema = z
  .object({
    fullName: z.string().min(1, "nameRequired"),
    email: z.string().min(1, "emailRequired").email("emailInvalid"),
    password: z.string().min(8, "passwordMin"),
    confirmPassword: z.string().min(1, "passwordRequired"),
    phone: z.string().min(1),
    partnerType: z.enum(
      ["VILLAGE_ADMIN", "ACCOMMODATION", "UMKM", "EVENT_ORGANIZER", "TRANSPORT"],
      {
        required_error: "partnerTypeRequired",
      }
    ),
    organizationName: z.string().min(1),
    address: z.string().min(1),
    agreeTerms: z.boolean().refine((v) => v === true, {
      message: "mustAgreeTerms",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "passwordMismatch",
    path: ["confirmPassword"],
  });

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;

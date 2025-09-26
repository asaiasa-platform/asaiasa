import { z } from "zod";

// Login validation schema
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: "กรุณากรอกอีเมล" })
    .email({ message: "รูปแบบอีเมลไม่ถูกต้อง" }),
  password: z
    .string()
    .min(1, { message: "กรุณากรอกรหัสผ่าน" }),
});

export type LoginFormData = z.infer<typeof loginSchema>;

// Signup validation schema
export const signupSchema = z
  .object({
    firstName: z
      .string()
      .min(1, { message: "กรุณากรอกชื่อ" })
      .max(50, { message: "ชื่อต้องไม่เกิน 50 ตัวอักษร" }),
    lastName: z
      .string()
      .min(1, { message: "กรุณากรอกนามสกุล" })
      .max(50, { message: "นามสกุลต้องไม่เกิน 50 ตัวอักษร" }),
    email: z
      .string()
      .min(1, { message: "กรุณากรอกอีเมล" })
      .email({ message: "รูปแบบอีเมลไม่ถูกต้อง" }),
    phone: z
      .string()
      .min(1, { message: "กรุณากรอกเบอร์โทรศัพท์" })
      .regex(/^\d+$/, { message: "กรุณากรอกตัวเลขเท่านั้น" })
      .min(10, { message: "เบอร์โทรศัพท์ต้องมี 10 หลัก" })
      .max(10, { message: "เบอร์โทรศัพท์ต้องมี 10 หลัก" }),
    password: z
      .string()
      .min(8, { message: "รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร" })
      .regex(/[A-Z]/, { message: "ต้องมีตัวอักษรพิมพ์ใหญ่อย่างน้อย 1 ตัว" })
      .regex(/[a-z]/, { message: "ต้องมีตัวอักษรพิมพ์เล็กอย่างน้อย 1 ตัว" })
      .regex(/\d/, { message: "ต้องมีตัวเลขอย่างน้อย 1 ตัว" })
      .regex(/[!@#$%^&*_]/, {
        message: "ต้องมีอักขระพิเศษอย่างน้อย 1 ตัว (!@#$%^&*_)",
      }),
    confirmPassword: z.string(),
    policies: z.boolean().refine((val) => val === true, {
      message: "กรุณายอมรับข้อกำหนดและนโยบาย",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "รหัสผ่านไม่ตรงกัน",
    path: ["confirmPassword"],
  });

export type SignupFormData = z.infer<typeof signupSchema>;

// User profile type
export interface UserProfile {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  picUrl: string;
  language: string;
  role: string;
  updatedAt: string;
}

// Auth context type
export interface AuthContextType {
  isAuth: boolean | null;
  userProfile: UserProfile | null;
  loading: boolean;
  setAuthState: () => Promise<void>;
  removeAuthState: () => Promise<void>;
}

// API response types
export interface AuthResponse {
  success: boolean;
  message?: string;
  error?: string;
  data?: UserProfile;
  token?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  name: string;
  email: string;
  password: string;
  phone: string;
}

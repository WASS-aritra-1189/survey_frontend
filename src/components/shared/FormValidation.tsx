import { z } from 'zod';

// User validation schema
export const userSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters'),
  email: z
    .string()
    .trim()
    .email('Invalid email address')
    .max(255, 'Email must be less than 255 characters'),
  phone: z
    .string()
    .trim()
    .min(10, 'Phone number must be at least 10 digits')
    .max(20, 'Phone number is too long')
    .regex(/^[+]?[\d\s()-]+$/, 'Invalid phone number format'),
  role: z.enum(['field-agent', 'supervisor', 'manager', 'admin']),
  surveyLimit: z
    .number()
    .min(1, 'Survey limit must be at least 1')
    .max(100, 'Survey limit cannot exceed 100'),
});

// Survey validation schema
export const surveySchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, 'Survey name must be at least 3 characters')
    .max(200, 'Survey name must be less than 200 characters'),
  platform: z.enum(['mobile', 'web', 'both']),
});

// Device validation schema
export const deviceSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Device name must be at least 2 characters')
    .max(100, 'Device name must be less than 100 characters'),
  type: z.enum(['smartphone', 'tablet', 'desktop']),
  os: z
    .string()
    .trim()
    .min(2, 'OS must be at least 2 characters')
    .max(50, 'OS must be less than 50 characters'),
  assignedUser: z.string().optional(),
});

// GeoFence validation schema
export const geoFenceSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Zone name must be at least 2 characters')
    .max(100, 'Zone name must be less than 100 characters'),
  latitude: z
    .number()
    .min(-90, 'Latitude must be between -90 and 90')
    .max(90, 'Latitude must be between -90 and 90'),
  longitude: z
    .number()
    .min(-180, 'Longitude must be between -180 and 180')
    .max(180, 'Longitude must be between -180 and 180'),
  radius: z
    .number()
    .min(10, 'Radius must be at least 10 meters')
    .max(10000, 'Radius cannot exceed 10 kilometers'),
  alertOnExit: z.boolean(),
});

// Staff validation schema
export const staffSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters'),
  email: z
    .string()
    .trim()
    .email('Invalid email address')
    .max(255, 'Email must be less than 255 characters'),
  role: z.enum(['super-admin', 'admin', 'manager', 'supervisor']),
  modules: z.array(z.string()).min(1, 'Select at least one module'),
});

// Login validation schema
export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters'),
  otp: z
    .string()
    .length(6, 'OTP must be 6 digits')
    .optional(),
});

// Types
export type UserFormData = z.infer<typeof userSchema>;
export type SurveyFormData = z.infer<typeof surveySchema>;
export type DeviceFormData = z.infer<typeof deviceSchema>;
export type GeoFenceFormData = z.infer<typeof geoFenceSchema>;
export type StaffFormData = z.infer<typeof staffSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;

// Validation helper
export function validateForm<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; errors: Record<string, string> } {
  const result = schema.safeParse(data);
  
  if (result.success) {
    return { success: true, data: result.data };
  }
  
  const errors: Record<string, string> = {};
  result.error.errors.forEach((error) => {
    const path = error.path.join('.');
    errors[path] = error.message;
  });
  
  return { success: false, errors };
}

// Form field error display component
import { cn } from "@/lib/utils";

interface FormErrorProps {
  error?: string;
  className?: string;
}

export function FormError({ error, className }: FormErrorProps) {
  if (!error) return null;
  
  return (
    <p className={cn("text-sm text-destructive mt-1 animate-fade-in", className)}>
      {error}
    </p>
  );
}

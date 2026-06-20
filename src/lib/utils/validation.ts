import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(6, 'Minimum 6 caractères'),
})

export const registerSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(8, 'Minimum 8 caractères'),
  confirmPassword: z.string(),
  fullName: z.string().min(2, 'Nom requis'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Les mots de passe ne correspondent pas',
  path: ['confirmPassword'],
})

export const companySchema = z.object({
  name: z.string().min(2, 'Nom requis'),
  address: z.string().optional(),
  city: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email('Email invalide').optional().or(z.literal('')),
  rc: z.string().optional(),
  if_: z.string().optional(),
  ice: z.string().min(15, 'ICE doit être 15 chiffres').max(15),
  cnss: z.string().optional(),
  patente: z.string().optional(),
  responsable: z.string().optional(),
})

export const quoteItemSchema = z.object({
  produit: z.string().min(1, 'Produit requis'),
  description: z.string().optional(),
  quantite: z.number().min(0.01, 'Quantité requise'),
  unite: z.string().default('U'),
  prix_unitaire: z.number().min(0, 'Prix requis'),
})

export type LoginForm = z.infer<typeof loginSchema>
export type RegisterForm = z.infer<typeof registerSchema>
export type CompanyForm = z.infer<typeof companySchema>
export type QuoteItemForm = z.infer<typeof quoteItemSchema>

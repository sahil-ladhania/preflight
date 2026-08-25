/**
 * brand-kit — Bluepeak client kit DTO for generate + preview.
 * Why: doc 19 §8.1 fixture shape; not Preflight UI tokens.
 */

import { z } from "zod"
import { ChannelSchema } from "./enums.js"

export const BrandKitVoiceSchema = z.object({
  tone: z.string().min(1),
  do: z.array(z.string().min(1)),
  dont: z.array(z.string().min(1)),
})
export type BrandKitVoice = z.infer<typeof BrandKitVoiceSchema>

export const BrandKitTypographySchema = z.object({
  headingRole: z.string().min(1),
  bodyRole: z.string().min(1),
})
export type BrandKitTypography = z.infer<typeof BrandKitTypographySchema>

export const BrandKitColorsSchema = z.object({
  primary: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  secondary: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  background: z.string().regex(/^#[0-9a-fA-F]{6}$/),
})
export type BrandKitColors = z.infer<typeof BrandKitColorsSchema>

export const BrandKitChannelHintSchema = z.object({
  maxHeadlineChars: z.number().int().min(1).optional(),
  layoutNotes: z.string().min(1).optional(),
})
export type BrandKitChannelHint = z.infer<typeof BrandKitChannelHintSchema>

export const BrandKitDTOSchema = z.object({
  kitId: z.string().min(1),
  clientName: z.string().min(1),
  voice: BrandKitVoiceSchema,
  forbiddenClaims: z.array(z.string().min(1)),
  requiredDisclaimer: z.string().min(1),
  typography: BrandKitTypographySchema,
  colors: BrandKitColorsSchema,
  channelHints: z.record(ChannelSchema, BrandKitChannelHintSchema),
})
export type BrandKitDTO = z.infer<typeof BrandKitDTOSchema>

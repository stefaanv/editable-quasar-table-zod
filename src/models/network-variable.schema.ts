import z from 'zod'

export const NwVarTypeValues = ['bool', 'byte'] as const
export const NwVarTypeEnum = z.enum(NwVarTypeValues)
export type NwVarType = z.infer<typeof NwVarTypeEnum>

export const NwVarDirectionValues = ['in', 'out'] as const
export const NwVarDirectionEnum = z.enum(NwVarDirectionValues)
export type NwVarDirection = z.infer<typeof NwVarDirectionEnum>

export const NwVarUseValues = ['button', 'motor', 'opening_rolluik_pct'] as const
export const NwVarUseEnum = z.enum(NwVarUseValues)
export type NwVarUse = z.infer<typeof NwVarUseEnum>

export const NetworkVariableSchema = z.object({
  plc: z.string().min(1), // PLC name reference, not the full PlcSchema
  name: z.string().min(1),
  description: z.string().min(1),
  type: NwVarTypeEnum.default('bool'),
  direction: NwVarDirectionEnum.default('in'),
  use: NwVarUseEnum.default('button'),
  address: z.number().int().min(0),
})

export type NetworkVariableWithoutId = z.infer<typeof NetworkVariableSchema>
export type NetworkVariable = NetworkVariableWithoutId & { id: number }

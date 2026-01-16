/**
 * Zod schema for robot specifications validation
 * Used for both TypeScript type inference and runtime validation
 */
import { z } from 'zod'

export const RobotSpecsSchema = z.object({
  // Physical capabilities
  payload_capacity: z.number().min(0).optional(),
  weight_kg: z.number().min(0).optional(),
  height_cm: z.number().min(0).optional(),

  // Autonomy
  runtime_minutes: z.number().min(0).optional(),
  battery_kwh: z.number().min(0).optional(),

  // Mobility
  max_speed: z.number().min(0).optional(),
  dof: z.number().int().min(0).optional(),

  // Environment
  ip_rating: z.enum(['none', 'ip54', 'ip65', 'ip67', 'ip68']).optional(),
  terrain_handling: z.enum(['flat_floor', 'slopes_10_deg', 'stairs_and_rubble']).optional(),

  // Interaction
  interaction_tech_level: z.enum(['none', 'basic_voice', 'screen_face', 'llm_integrated']).optional(),
  obstacle_avoidance: z.enum(['static_only', 'stop_and_wait', 'dynamic_rerouting']).optional(),

  // Manipulation
  grasping_versatility: z.enum(['suction_only', 'parallel_gripper', 'humanoid_hand_5_fingers']).optional(),

  // Integration
  fleet_integration: z.boolean().optional(),
  teleoperation_ready: z.boolean().optional(),

}).passthrough() // Allow additional fields not defined in schema

export type RobotSpecs = z.infer<typeof RobotSpecsSchema>

export interface ValidationResult<T> {
  success: boolean
  data?: T
  error?: string
}

/**
 * Validate robot specifications at runtime
 * @param specs - Raw specs object from database or API
 * @returns Validation result with typed data or error message
 */
export function validateRobotSpecs(specs: unknown): ValidationResult<RobotSpecs> {
  const result = RobotSpecsSchema.safeParse(specs)
  if (result.success) {
    return { success: true, data: result.data }
  }
  return {
    success: false,
    error: result.error.issues.map(i => `${i.path.join('.')}: ${i.message}`).join(', ')
  }
}

/**
 * Get a list of all known spec keys (for admin UI)
 */
export const KNOWN_SPEC_KEYS = [
  'payload_capacity',
  'weight_kg',
  'height_cm',
  'runtime_minutes',
  'battery_kwh',
  'max_speed',
  'dof',
  'ip_rating',
  'terrain_handling',
  'interaction_tech_level',
  'obstacle_avoidance',
  'grasping_versatility',
  'fleet_integration',
  'teleoperation_ready',
] as const

<template></template>

<script setup lang="ts" generic="T extends z.ZodRawShape">
import z from 'zod'

const props = withDefaults(
  defineProps<{
    rowModel: z.ZodObject<T>
    data?: z.infer<z.ZodObject<T>>[]
  }>(),
  {
    rowModel: () => z.object({}) as z.ZodObject<T>,
    data: () => [],
  },
)
</script>

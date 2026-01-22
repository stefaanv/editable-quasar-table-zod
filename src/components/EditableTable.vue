<template></template>

<script setup lang="ts" generic="T extends z.ZodRawShape">
import z from 'zod';
import { PropType } from 'vue';

const props = withDefaults(
  defineProps<{
    rowModel: z.ZodObject<T>;
    data?: PropType<z.infer<z.ZodObject<T>>[]>;
  }>(),
  {
    rowModel: () => z.object({}) as z.ZodObject<T>,
    data: () => [],
  },
);
</script>

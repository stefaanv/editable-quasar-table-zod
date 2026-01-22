<template>
  <p>{{ props.data[0] }}</p>
  <q-table :columns="columns" :rows="props.data" row-key="id" v-bind="$attrs">
    <template v-slot:body="props">
      <q-tr :props="props">
        <q-td v-for="col in props.cols" :key="col.name" :props="props">
          {{ props.row[col.name] }}
        </q-td>
      </q-tr>
    </template>
  </q-table>
</template>

<script setup lang="ts" generic="T extends z.ZodRawShape">
import z from 'zod'
import { computed } from 'vue'
import type { QTableColumn } from 'quasar'

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(
  defineProps<{
    rowModel: z.ZodObject<T>
    data?: z.infer<z.ZodObject<T>>[]
    headerClass?: string
    headerStyle?: string
  }>(),
  {
    rowModel: () => z.object({}) as z.ZodObject<T>,
    data: () => [],
    headerClass: '',
    headerStyle: '',
  },
)

const columns = computed<QTableColumn[]>(() =>
  Object.keys(props.rowModel.shape).map((key) => ({
    name: key,
    label: key.charAt(0).toUpperCase() + key.slice(1),
    field: key,
    align: 'left',
    sortable: true,
    headerClasses: props.headerClass,
    headerStyle: props.headerStyle,
  })),
)
/*
An editable table component built with Vue 3, TypeScript, Zod, and Quasar Framework. It dynamically generates table columns based on a provided Zod schema and displays data accordingly. The component supports customization of header and title styles through props.
Title formatting through title-class and title-style props is NOT supported !!
*/
</script>

<style scoped></style>

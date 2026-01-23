<template>
  <p>{{ props.data[0] }}</p>
  <q-table :columns="columns" :rows="props.data" :row-key="props.rowKey" v-bind="$attrs">
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
    rowKey: keyof z.infer<z.ZodObject<T>>
    rowModel: z.ZodObject<T>
    data?: z.infer<z.ZodObject<T>>[]
    headerClass?: string
    headerStyle?: string
    editable: boolean
    editableColumns?: Array<keyof z.infer<z.ZodObject<T>>>
    createNewRowFn: () => z.infer<z.ZodObject<T>>
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
</script>

<style scoped></style>

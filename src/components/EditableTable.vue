<template>
  <p>{{ props.data[0] }}</p>
  <q-table :columns="columns" :rows="props.data" :row-key="props.rowKey" v-bind="$attrs">
    <template v-slot:body="props">
      <q-tr :props="props">
        <q-td v-for="col in props.cols" :key="col.name" :props="props">
          {{ getRowValue(props.row, col.name) }}
          <template
            v-if="col.isString && editable && editableColumns && editableColumns.includes(col.name)"
          >
            <q-popup-edit v-model="props.row[col.name]">
              <q-input v-model="props.row[col.name]" autofocus dense />
            </q-popup-edit>
          </template>
        </q-td>
      </q-tr>
    </template>
  </q-table>
</template>

<script setup lang="ts" generic="T extends z.ZodRawShape">
import z from 'zod'
import { computed } from 'vue'
import type { QTableColumn } from 'quasar'

type RowModel = z.ZodObject<T>
type Row = z.infer<RowModel>
type RowKey = keyof Row

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(
  defineProps<{
    columnLabels?: Partial<Record<RowKey, string>>
    rowKey: string
    rowModel: RowModel
    data?: Row[]
    headerClass?: string
    headerStyle?: string
    editable: boolean
    editableColumns?: Array<RowKey>
    createNewRowFn: () => Row
  }>(),
  {
    rowModel: () => z.object({}) as RowModel,
    data: () => [],
    headerClass: '',
    headerStyle: '',
  },
)

function getRowValue(row: Record<string, unknown>, key: string) {
  return row[key]
}

function getColumnLabel(
  labels: Partial<Record<RowKey, string>> | undefined,
  key: string,
): string | undefined {
  return labels && (labels as Record<string, string>)[key]
}

const columns = computed<QTableColumn[]>(() =>
  Object.keys(props.rowModel.shape).map((key) => {
    const isString = props.rowModel.shape[key] instanceof z.ZodString
    const colLabel = getColumnLabel(props.columnLabels, key)
    const label = colLabel ?? key.charAt(0).toUpperCase() + key.slice(1)
    return {
      name: key,
      label,
      field: key,
      align: 'left',
      sortable: true,
      headerClasses: props.headerClass,
      headerStyle: props.headerStyle,
      isString,
    }
  }),
)
</script>

<style scoped></style>

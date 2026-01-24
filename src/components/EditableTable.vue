<template>
  <p>{{ props.data[0] }}</p>
  <q-table :columns="columns" :rows="props.data" :row-key="props.rowKey" v-bind="$attrs">
    <template v-slot:body="props">
      <q-tr :props="props">
        <q-td v-for="col in props.cols" :key="col.name" :props="props">
          {{ props.row[col.name] }}
          <template
            v-if="col.colEditType === 'input' && editable && editableColumns?.includes(col.name)"
          >
            <q-popup-edit
              v-model="props.row[col.name]"
              v-slot="scope"
              @save="(newValue) => handleSave(col.colType, props.row, col.name, newValue)"
            >
              <q-input
                v-model="scope.value"
                autofocus
                dense
                @keyup.enter="scope.set"
                @keyup.esc="scope.cancel"
                :type="col.inputSubType"
                :mask="col.mask"
                :step="col.step"
              />
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
import { type QTableColumn } from 'quasar'

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
    hideColumns?: Array<RowKey>
    createNewRowFn: () => Row
    updateRow?: (row: Row) => void
  }>(),
  {
    rowModel: () => z.object({}) as RowModel,
    data: () => [],
    headerClass: '',
    headerStyle: '',
  },
)

const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1)

const getColumnLabel = (key: string) =>
  (props.columnLabels as Record<string, string> | undefined)?.[key]

const handleSave = (colType: string, row: Row, colName: RowKey, newValue: string) => {
  // Find the column type for this column
  const cleanedValue = cleanInput(colType, newValue)
  // TypeScript can't narrow generic indexed types, so we need to suppress this
  // @ts-expect-error - runtime check ensures type safety
  row[colName] = cleanedValue
  props.updateRow?.(row)
}
type PropType = { type: 'string' | 'integer' | 'number' | 'boolean'; enum?: string[] }

const columns = computed<QTableColumn[]>(() =>
  Object.keys(props.rowModel.shape)
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    .filter((key) => !(props.hideColumns ?? ([] as Array<RowKey>)).includes(key as RowKey))
    .map((key) => {
      const colSchema = props.rowModel.toJSONSchema().properties?.[key] as PropType
      const colType = colSchema?.type ?? 'string'
      const colEditType =
        colSchema.type === 'boolean' ? 'checkbox' : colSchema.enum ? 'dropdown' : 'input'
      const enumEntries = colEditType === 'dropdown' && 'enum' in colSchema ? colSchema.enum : []
      // console.log(key, colEditType)
      return {
        name: key,
        label: getColumnLabel(key) ?? capitalize(key),
        field: key,
        align: 'left' as const,
        sortable: true,
        headerClasses: props.headerClass,
        headerStyle: props.headerStyle,
        colType,
        colEditType,
        inputSubType: colEditType === 'input' ? 'text' : 'number',
        enumEntries,
        mask: colSchema.type === 'integer' ? '##########' : undefined,
        step: colSchema.type === 'integer' ? '1' : 'any',
      }
    }),
)

function cleanInput(colType: string, newValue: string) {
  if (colType === 'integer') {
    newValue = parseInt(newValue).toString()
  }
  console.log('Cleaning input', colType, newValue)
  return newValue
}
</script>

<style scoped></style>

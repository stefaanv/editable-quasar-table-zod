<template>
  <q-table :columns="columns" :rows="props.data" :row-key="props.rowKey" v-bind="$attrs">
    <template v-slot:body="slotProps">
      <q-tr :props="slotProps">
        <q-td v-for="col in slotProps.cols" :key="col.name" :props="slotProps">
          <q-checkbox
            v-if="col.editable && col.colEditType === 'checkbox'"
            v-model="slotProps.row[col.name]"
            dense
            @update:model-value="() => props.updateRow?.(slotProps.row)"
          />
          <template v-else>
            {{ slotProps.row[col.name] }}
            <template v-if="col.editable">
              <q-popup-edit
                v-model="slotProps.row[col.name]"
                v-slot="scope"
                @save="(newValue) => handleSave(slotProps.row, col.name, newValue)"
              >
                <q-input
                  v-if="col.colEditType === 'text'"
                  v-model="scope.value"
                  v-bind="inputProps(col.colEditType, scope)"
                />
                <q-input
                  v-if="['integer', 'real'].includes(col.colEditType)"
                  v-model.number="scope.value"
                  v-bind="{
                    ...inputProps(col.colEditType, scope),
                    ...numericInputHandlers(col.colEditType, scope),
                  }"
                />
              </q-popup-edit>
            </template>
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
// eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
type RowKey = keyof Row | '*'

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
type PropType = { type: 'string' | 'integer' | 'number' | 'boolean'; enum?: string[] }
type ColEditType = 'text' | 'integer' | 'real' | 'dropdown' | 'checkbox'

const getColumnLabel = (key: string) =>
  (props.columnLabels as Record<string, string> | undefined)?.[key]

const handleSave = (row: Row, colName: RowKey, newValue: string) => {
  // TypeScript can't narrow generic indexed types, so we need to suppress this
  // @ts-expect-error - runtime check ensures type safety
  row[colName] = newValue
  props.updateRow?.(row)
}

const parseNumericValue = (colEditType: string, value: string | number | null) => {
  const parser = colEditType === 'integer' ? parseInt : parseFloat
  return value ? parser(value.toString()) : 0
}

const numericInputHandlers = (
  colEditType: string,
  scope: { value: unknown; set: () => void; cancel: () => void },
) => ({
  'onUpdate:modelValue': (val: string | number | null) => {
    scope.value = parseNumericValue(colEditType, val)
  },
  onBlur: (e: Event) => {
    scope.value = parseNumericValue(colEditType, (e.target as HTMLInputElement).value)
  },
  type: 'number' as const,
  'input-class': 'no-spinners',
  step: colEditType === 'integer' ? ('1' as const) : ('any' as const),
})

const inputProps = (
  editType: ColEditType,
  scope: { value: unknown; set: () => void; cancel: () => void },
) => {
  return {
    autofocus: true,
    dense: true,
    onKeyup: (e: KeyboardEvent) => {
      if (e.key === 'Enter') scope.set()
    },
  }
}

const CONVERT_COL_TYPES: Record<string, ColEditType> = {
  string: 'text',
  integer: 'integer',
  number: 'real',
  boolean: 'checkbox',
}

const columns = computed<QTableColumn[]>(() =>
  Object.keys(props.rowModel.shape)
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    .filter((key) => !(props.hideColumns ?? []).includes(key as RowKey))
    .map((key) => {
      const colSchema = props.rowModel.toJSONSchema().properties?.[key] as PropType
      const colEditType: ColEditType = colSchema.enum
        ? 'dropdown'
        : (CONVERT_COL_TYPES[colSchema.type] ?? 'text')
      const editable =
        props.editable &&
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
        (props.editableColumns?.includes(key as RowKey) || props.editableColumns?.includes('*'))
      // console.log(key, editable, colEditType)

      return {
        name: key,
        label: getColumnLabel(key) ?? capitalize(key),
        field: key,
        align: 'left' as const,
        sortable: true,
        headerClasses: props.headerClass,
        headerStyle: props.headerStyle,
        colEditType,
        editable,
      }
    }),
)
</script>

<style scoped></style>

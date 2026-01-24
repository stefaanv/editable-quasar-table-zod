<template>
  <p>{{ props.data[0] }}</p>
  <q-table :columns="columns" :rows="props.data" :row-key="props.rowKey" v-bind="$attrs">
    <template v-slot:body="props">
      <q-tr :props="props">
        <q-td v-for="col in props.cols" :key="col.name" :props="props">
          {{ props.row[col.name] }}
          <template v-if="col.colEditType === 'string' && editable && editableColumns?.includes(col.name)">
            <q-popup-edit v-model="props.row[col.name]" v-slot="scope"
              @save="(newValue) => handleSave(props.row, col.name, newValue)">
              <q-input v-model="scope.value" autofocus dense @keyup.enter="scope.set" @keyup.esc="scope.cancel" />
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

const handleSave = (row: Row, colName: RowKey, newValue: string) => {
  // TypeScript can't narrow generic indexed types, so we need to suppress this
  // @ts-expect-error - runtime check ensures type safety
  row[colName] = newValue
  props.updateRow?.(row)
}

const columns = computed<QTableColumn[]>(() =>
  Object.keys(props.rowModel.shape)
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    .filter((key) => !(props.hideColumns ?? ([] as Array<RowKey>)).includes(key as RowKey))
    .map((key) => {
      const schema = props.rowModel.toJSONSchema().properties?.[key]
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const propertySchema = props.rowModel.shape[key] as z.ZodType<any, unknown>
      const isEnum = getBaseEnum(propertySchema) !== null
      const enumEntries: string[] = isEnum
        ? getBaseEnum(propertySchema)!.options
        : []
      if (isEnum) console.log(key, enumEntries)

      const colEditType = isEnum
        ? 'enum'
        : typeof schema === 'object' && schema && 'type' in schema
          ? schema.type
          : undefined

      return {
        name: key,
        label: getColumnLabel(key) ?? capitalize(key),
        field: key,
        align: 'left' as const,
        sortable: true,
        headerClasses: props.headerClass,
        headerStyle: props.headerStyle,
        colEditType,
      }
    }),
)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getBaseEnum(zodType: z.ZodTypeAny): z.ZodEnum<any> | null {
  // 1. Direct check
  if (zodType instanceof z.ZodEnum) {
    return zodType
  }

  // 2. Unwrap Default or Optional
  // We check for the existence of _def safely
  if ('_def' in zodType) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const def = (zodType as any)._def

    if (zodType instanceof z.ZodDefault || zodType instanceof z.ZodOptional) {
      return getBaseEnum(def.innerType)
    }
  }

  return null
}
</script>

<style scoped></style>

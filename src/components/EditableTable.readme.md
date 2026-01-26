# EditableTable Component

A feature-rich, schema-driven editable table component built with Vue 3, TypeScript, Zod, and Quasar Framework. It automatically generates table columns based on a Zod schema and provides inline editing capabilities for various data types.

## Features

### Schema-Driven Column Generation

- Automatically generates columns from a Zod schema
- Supports multiple data types: `string`, `integer`, `number` (real), `boolean`
- Handles enum values as dropdown selects
- Type-safe with full TypeScript support

### Inline Editing

- Click-to-edit functionality via popup editors
- Different input types based on column data type:
  - **Text**: Standard text input with Enter key support
  - **Integer**: Number input that auto-cleans values (e.g., `00001` → `1`)
  - **Real numbers**: Decimal number input with proper float parsing
  - **Boolean**: Always-visible checkboxes (disabled when table not editable)
  - **Dropdown**: Select from predefined enum values with auto-save

### Row Actions

- **Add**: Button to create new rows using a factory function
- **Clone**: Duplicate existing rows with all values except ID
- **Delete**: Remove rows with confirmation dialog
- Actions are optional and controllable via props
- Actions hidden when table is not editable

### Customization

- Custom column labels
- Hide specific columns
- Control which columns are editable (all or specific columns)
- Customizable header styling (class and inline styles)
- Adjustable pagination with configurable initial rows per page

### Pagination

- Built-in pagination with customizable options (3, 5, 7, 10, 15, 20, 25, 50 rows per page)
- Page navigation controls
- Record count display

## Props

### Required Props

| Prop | Type | Description |
|------|------|-------------|
| `rowKey` | `string` | Unique identifier field name for each row (e.g., `"id"`) |
| `rowModel` | `z.ZodObject<T>` | Zod schema defining the structure and types of table data |
| `editable` | `boolean` | Controls whether the table allows editing. When `false`, hides action buttons and disables editing |

### Optional Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `data` | `Row[]` | `[]` | Array of data rows to display in the table |
| `columnLabels` | `Partial<Record<RowKey, string>>` | `undefined` | Custom display labels for columns (key: column name, value: display label) |
| `headerClass` | `string` | `''` | CSS class(es) to apply to header cells |
| `headerStyle` | `string` | `''` | Inline CSS styles for header cells |
| `editableColumns` | `Array<RowKey \| '*'>` | `undefined` | Specifies which columns are editable. Use `['*']` for all columns or specify column names |
| `hideColumns` | `Array<RowKey>` | `undefined` | Array of column names to hide from display |
| `initialRowsPerPage` | `number` | `5` | Initial number of rows to display per page |
| `actions` | `Action[]` | `[]` | Array defining available actions: `'add'`, `'clone'`, `'delete'` |
| `updateRow` | `(row: Row) => void` | `undefined` | Callback function when a row is updated |
| `addRow` | `(row?: Row) => void` | `undefined` | Callback function to add a new row. Optional parameter for cloning |
| `deleteRow` | `(row: Row) => void` | `undefined` | Callback function when a row is deleted |

### Additional Attributes
The component uses `inheritAttrs: false` and binds remaining attributes directly to the underlying `q-table`, allowing you to pass any standard Quasar table props like `flat`, `bordered`, `dense`, etc.

## Type Definitions

```typescript
type Action = 'add' | 'clone' | 'delete'
type RowKey = keyof Row | '*'
```

## Usage Example

```vue
<template>
  <editable-table
    row-key="id"
    :row-model="HealthcareProviderSchema"
    :data="store.data"
    :editable="true"
    :editable-columns="['*']"
    :hide-columns="['id']"
    :column-labels="{
      firstName: 'First Name',
      lastName: 'Last Name',
      isActive: 'Active'
    }"
    :actions="['add', 'clone', 'delete']"
    :update-row="store.updateRow"
    :add-row="store.addRow"
    :delete-row="store.deleteRow"
    :initial-rows-per-page="10"
    header-class="bg-primary text-white"
    bordered
    flat
  />
</template>

<script setup lang="ts">
import { z } from 'zod'
import EditableTable from './components/EditableTable.vue'

const HealthcareProviderSchema = z.object({
  id: z.number(),
  firstName: z.string(),
  lastName: z.string(),
  age: z.number(),
  salary: z.number(),
  isActive: z.boolean(),
  role: z.enum(['doctor', 'nurse', 'admin'])
})

// Your store implementation
const store = {
  data: [...],
  updateRow: (row) => { /* update logic */ },
  addRow: (template) => { /* add logic */ },
  deleteRow: (row) => { /* delete logic */ }
}
</script>
```

## Column Type Mappings

The component automatically maps Zod schema types to appropriate input controls:

| Zod Type | Input Control | Behavior |
|----------|---------------|----------|
| `z.string()` | `q-input` (text) | Standard text input |
| `z.number()` | `q-input` (number) | Decimal number input with `parseFloat` |
| `z.number().int()` | `q-input` (number) | Integer input with automatic value cleanup |
| `z.boolean()` | `q-checkbox` | Always visible, disabled when not editable |
| `z.enum([...])` | `q-select` | Dropdown with auto-save on selection |

## Action Validation

The component validates that required callback functions are provided for enabled actions:

- If `actions` includes `'add'` but no `addRow` prop is provided → Console warning
- If `actions` includes `'clone'` but no `addRow` prop is provided → Console warning  
- If `actions` includes `'delete'` but no `deleteRow` prop is provided → Console warning

## Notes

- **Header styling**: Only `headerClass` and `headerStyle` props affect header appearance. Title-level formatting is not supported
- **Delete confirmation**: Delete action shows a confirmation dialog before removing rows
- **Keyboard shortcuts**: Press Enter in text/number inputs to save changes
- **Auto-cleanup**: Integer inputs automatically clean leading zeros (e.g., `00042` becomes `42`)

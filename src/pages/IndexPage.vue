<template>
  <q-page class="row items-center justify-evenly">
    <editable-table
      :row-model="NetworkVariableSchema"
      :data="store.$state"
      flat
      bordered
      header-class="text-h6 bg-blue text-white"
      header-style="font-size: 0.9rem;"
    />
  </q-page>
</template>

<script setup lang="ts">
import EditableTable from 'src/components/EditableTable.vue'
import { NetworkVariableSchema } from 'src/models/network-variable.schema'
import { useTableExampleStore } from 'src/stores/table-example-store'
const store = useTableExampleStore()
</script>

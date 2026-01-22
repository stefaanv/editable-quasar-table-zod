<template>
  <q-page class="row items-center justify-evenly">
    <editable-table :row-model="NetworkVariableSchema" :data="[...store.$state]"> </editable-table>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import EditableTable from 'src/components/EditableTable.vue'
import { NetworkVariableSchema } from 'src/models/network-variable.schema'
import { useTableExampleStore } from 'src/stores/table-example-store'
const store = useTableExampleStore()
</script>

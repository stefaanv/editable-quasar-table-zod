<template>
  <q-page class="row items-center justify-evenly">
    <editable-table
      row-key="id"
      :row-model="NetworkVariableSchema"
      :data="store.$state"
      flat
      bordered
      header-class="text-h6 bg-blue text-white"
      header-style="font-size: 0.9rem;"
      :editable="true"
      :editable-columns="['name', 'description']"
      :hide-columns="['id']"
      :create-new-row-fn="() => createNetworkVariable('garage')"
      :column-labels="{ description: 'Omschrijving' }"
    />
  </q-page>
</template>

<script setup lang="ts">
import EditableTable from 'src/components/EditableTable.vue'
import { createNetworkVariable, NetworkVariableSchema } from 'src/models/network-variable.schema'
import { useTableExampleStore } from 'src/stores/table-example-store'
const store = useTableExampleStore()
</script>

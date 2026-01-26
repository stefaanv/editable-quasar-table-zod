<template>
  <q-page class="row items-center justify-evenly">
    <editable-table
      row-key="id"
      :row-model="HealthcareProviderSchema"
      :data="store.data"
      flat
      bordered
      header-class="text-h6 bg-blue text-white"
      header-style="font-size: 1rem;"
      :editable="false"
      :editable-columns="['*']"
      :hide-columns="['id']"
      :column-labels="{
        requestCounter: 'Teller',
        firstName: 'Voornaam',
        name: 'Familienaam',
        address: 'Adres',
        docType: 'Soort',
      }"
      :update-row="store.updateRow"
      :add-row="store.addRow"
      :delete-row="store.deleteRow"
      :initial-rows-per-page="10"
      :actions="['add', 'clone', 'delete']"
    />
  </q-page>
</template>

<script setup lang="ts">
import EditableTable from 'src/components/EditableTable.vue'
import { HealthcareProviderSchema } from 'src/models/healthcare-provider.schema'

import { useTableExampleStore } from 'src/stores/table-example-store'
const store = useTableExampleStore()
</script>

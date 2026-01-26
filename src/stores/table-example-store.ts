import { defineStore, acceptHMRUpdate } from 'pinia'
import { ref } from 'vue'
import { type HealthcareProvider } from 'src/models/healthcare-provider.schema'

export const useTableExampleStore = defineStore('tableExample', () => {
  const data = ref<HealthcareProvider[]>(
    [
      [1, 'Hilde', 'Moerman', 'Marke', 'dokter', 145, true],
      [2, 'Karen', 'Bruyland', 'Kortrijk', 'bioloog', 0, true],
      [3, 'Hendrik', 'De Bosschere ', 'Kortrijk', 'dierenarts', 10, false],
    ].map(
      ([id, firstName, name, address, docType, rqc, active]) =>
        ({ id, firstName, name, address, docType, requestCounter: rqc, active }) as HealthcareProvider, //prettier-ignore
    ),
  )

  function updateRow(updatedRow: HealthcareProvider) {
    console.log('Updating row:', updatedRow.id, '=>', updatedRow)
    const row = data.value.find((r) => r.id === updatedRow.id)!
    Object.assign(row, updatedRow)
  }
  return { data, updateRow }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useTableExampleStore, import.meta.hot))
}

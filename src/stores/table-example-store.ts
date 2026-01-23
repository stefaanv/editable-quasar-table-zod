import { defineStore, acceptHMRUpdate } from 'pinia'
import { ref } from 'vue'
import type { NetworkVariable } from 'src/models/network-variable.schema'

export const useTableExampleStore = defineStore('tableExample', () => {
  const data = ref<NetworkVariable[]>(
    [
      [1, 'Garage', 'clp_living', 'Licht Living', 'bool', 'in', 'button', 0],
      [2, 'Garage', 'rl_pct_bureau', 'pct rolluik Bureau', 'type', 'in', 'opening_rolluik_pct', 1],
      [3, 'Liftkoker', 'garage_poort_motor', 'Motor garage poort', 'bool', 'out', 'motor', 10],
    ].map(
      ([id, plc, name, description, type, direction, use, address]) =>
        ({ id, plc, name, description, type, direction, use, address }) as NetworkVariable,
    ),
  )

  function updateRow(updatedRow: NetworkVariable) {
    console.log('Updating row:', updatedRow.id, '=>', updatedRow)
  }
  return { data, updateRow }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useTableExampleStore, import.meta.hot))
}

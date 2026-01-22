import { defineStore, acceptHMRUpdate } from 'pinia'
import type { NetworkVariable } from 'src/models/network-variable.schema'

export const useTableExampleStore = defineStore('tableExample', {
  state: () =>
    [
      {
        id: 1,
        plc: 'Garage',
        name: 'clp_living',
        description: 'Licht Living',
        type: 'bool',
        direction: 'in',
        use: 'button',
        address: 0,
      },
      {
        id: 2,
        plc: 'Garage',
        name: 'rl_pct_bureau',
        description: 'Opening pct rolluik Bureau vooraan',
        type: 'byte',
        direction: 'in',
        use: 'opening_rolluik_pct',
        address: 1,
      },
      {
        id: 3,
        plc: 'Liftkoker',
        name: 'garage_poort_motor',
        description: 'Activatie motor garage poort',
        type: 'bool',
        direction: 'out',
        use: 'motor',
        address: 10,
      },
    ] as Array<NetworkVariable>,
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useTableExampleStore, import.meta.hot))
}

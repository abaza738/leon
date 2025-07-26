export const ORDER_STATUS_CONFIG = [
  {label: 'Pending', value: 'pending', color: 'gray'},
  {label: 'Confirmed', value: 'confirmed', color: 'blue'},
  {label: 'Preparing', value: 'preparing', color: 'yellow'},
  {label: 'Ready', value: 'ready', color: 'indigo'},
  {label: 'Delivered', value: 'delivered', color: 'green'},
  {label: 'Cancelled', value: 'cancelled', color: 'red'}
]

export type OrderStatusColor = 'blue' | 'yellow' | 'red' | 'green' | 'gray' | 'indigo'

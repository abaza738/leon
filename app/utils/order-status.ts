import type {Order} from '~/types/restaurant'
import {ORDER_STATUS_CONFIG, type OrderStatusColor} from '~/constants/order-status'

/**
 * Get the color for an order status
 */
export function getOrderStatusColor(status: Order['status']): OrderStatusColor {
  const statusConfig = ORDER_STATUS_CONFIG.find((config) => config.value === status)
  return (statusConfig?.color as OrderStatusColor) || 'gray'
}

/**
 * Get the display text for an order status
 */
export function getOrderStatusText(status: Order['status']): string {
  const statusConfig = ORDER_STATUS_CONFIG.find((config) => config.value === status)
  return statusConfig?.label || status
}

/**
 * Get the progress percentage for an order status
 */
export function getOrderStatusProgress(status: Order['status']): number {
  switch (status) {
    case 'pending':
      return 20
    case 'confirmed':
      return 40
    case 'preparing':
      return 60
    case 'ready':
      return 80
    case 'delivered':
      return 100
    case 'cancelled':
      return 0
    default:
      return 0
  }
}

export interface Product {
  id: string
  collectionId: string
  collectionName: string
  name: string
  description: string
  image: string
  price: number
  status: 'available' | 'out_of_stock'
  quantity: number
  category: string
  created_by: string
  created: string
  updated: string
}

export interface Order {
  id: string
  collectionId: string
  collectionName: string
  customer: string
  status: 'placed' | 'accepted' | 'rejected' | 'preparing' | 'finished'
  total_amount: number
  notes?: string
  rejection_reason?: string
  paid?: boolean
  created: string
  updated: string
}

export interface OrderItem {
  id: string
  collectionId: string
  collectionName: string
  order: string
  product: string
  quantity: number
  unit_price: number
  subtotal: number
  created: string
  updated: string
}

export interface CartItem {
  product: Product
  quantity: number
}

export interface CreateOrderData {
  customer: string
  status: string
  total_amount: number
  notes?: string
  paid?: boolean
}

export interface CreateOrderItemData {
  order: string
  product: string
  quantity: number
  unit_price: number
  subtotal: number
}

export interface User {
  id: string
  password: string
  tokenKey: string
  email: string
  emailVisibility: boolean
  verified: boolean
  name: string
  avatar: string
  role: 'customer' | 'admin'
  phone: number
  address: string
  created: string
  updated: string
}

export interface Cart {
  id: string
  user: string
  product: string
  quantity: number
  created: string
  updated: string
}

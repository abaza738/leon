export interface BaseRecord {
  id: string
  collectionId: string
  collectionName: string
  created: string
  updated: string
  expand?: Record<string, any>
}

export interface Product extends BaseRecord {
  name: string
  description: string
  base_price: number
  category: string // relation to categories collection
  image: string
  is_available: boolean
  preparation_time: number
  sort_order: number
  expand?: {category?: Category; [key: string]: any}
}

export interface Announcement extends BaseRecord {
  title: string
  is_active: boolean
  start_date: string
  end_date: string
}

export interface Category extends BaseRecord {
  name: string
  description: string
  image: string
  sort_order: number
  is_active: boolean
}

export interface Order extends BaseRecord {
  customer: string
  customer_name?: string
  customer_floor?: string
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled'
  subtotal: number
  total_amount: number
  order_type: 'now' | 'scheduled'
  delivery_time?: string
  payment_status: 'pending' | 'paid'
  payment_method: 'cash'
  notes?: string
  expand?: {
    customer?: User
    'order_items(order)'?: OrderItemWithProduct[]
    order_items_via_order?: OrderItemWithProduct[]
    [key: string]: any
  }
}

export interface OrderItem extends BaseRecord {
  order: string
  product: string
  product_name: string
  quantity: number
  selected_addons: Record<string, Array<{id: string; name: string; price: number}>> // Store full addon details instead of just IDs
  special_instructions?: string
  unit_price: number
  total_price: number
  expand?: {product?: Product; order?: Order; [key: string]: any}
}

export interface AddonGroup extends BaseRecord {
  product: string
  name: string
  description?: string
  type: 'radio' | 'checkbox'
  is_required: boolean
  min_selections: number
  max_selections: number
  sort_order: number
  is_active: boolean
  expand?: {addons_via_addon_group?: Addon[]; [key: string]: any}
}

export interface Addon extends BaseRecord {
  addon_group: string
  name: string
  description?: string
  price_modifier: number
  is_default: boolean
  is_available: boolean
  image?: string
  sort_order: number
  expand?: {addon_group?: AddonGroup; [key: string]: any}
}

export interface ProductAddon extends BaseRecord {
  product: string
  name: string
  description?: string
  price: number
  addon_type: 'ingredient' | 'size' | 'preparation' | 'extra'
  addon_group?: string
  is_default: boolean
  is_required: boolean
  min_selections: number
  max_selections: number
  status: 'active' | 'inactive'
  sort_order?: number
}

export interface SelectedAddon {
  addon_id: string
  name: string
  price: number
  addon_group?: string
}

export interface OrderItemAddon extends BaseRecord {
  order_item: string
  addon: string
  expand?: {addon?: ProductAddon; order_item?: OrderItem; [key: string]: any}
}

export interface CartItem extends BaseRecord {
  customer: string
  product: string
  quantity: number
  selected_addons: Record<string, Array<{id: string; name: string; price: number}>>
  special_instructions?: string
  item_total: number
  expand?: {product?: Product; customer?: User; [key: string]: any}
}

export interface OrderWithCustomer extends Order {
  expand?: {
    customer?: User
    'order_items(order)'?: OrderItemWithProduct[]
    order_items_via_order?: OrderItemWithProduct[]
    [key: string]: any
  }
}

export interface OrderItemWithProduct extends OrderItem {
  expand?: {
    product?: Product
    order_item_addons_via_order_item?: OrderItemAddon[]
    [key: string]: any
  }
}

export interface ProductWithAddons extends Product {
  expand?: {
    category?: Category
    addon_groups_via_product?: AddonGroup[]
    [key: string]: any
  }
}

export interface AddonGroupWithAddons extends AddonGroup {
  expand?: {addons_via_addon_group?: Addon[]; [key: string]: any}
}

export interface CreateOrderData {
  customer: string
  status: string
  subtotal: number
  total_amount: number
  order_type: 'now' | 'scheduled'
  delivery_time?: string
  payment_status: 'pending' | 'paid'
  payment_method: 'cash'
  notes?: string
}

export interface CreateOrderItemData {
  order: string
  product: string
  product_name: string
  quantity: number
  selected_addons: object
  special_instructions?: string
  unit_price: number
  total_price: number
}

export interface Review {
  id: string
  collectionId: string
  collectionName: string
  customer: string
  order: string
  product: string
  rating: number
  title?: string
  comment?: string
  helpful_count: number
  created: string
  updated: string
}

export interface User extends BaseRecord {
  password: string
  tokenKey: string
  email: string
  emailVisibility: boolean
  verified: boolean
  name: string
  avatar: string
  phone: string
  is_admin: boolean
  floor_number: number

  expand?: {orders_via_customer?: Order[]; [key: string]: any}
}

export interface Cart extends BaseRecord {
  customer: string
  product: string
  quantity: number
  selected_addons: Record<string, string[]>
  special_instructions?: string
  item_total: number
}

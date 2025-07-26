import PocketBase, {RecordService} from 'pocketbase'
import type {
  Product,
  Category,
  Order,
  OrderItem,
  User,
  Announcement,
  AddonGroup,
  Addon,
  ProductAddon,
  OrderItemAddon,
  CartItem
} from './restaurant'

export interface TypedPocketBase extends PocketBase {
  collection(idOrName: string): RecordService // default fallback for any other collection
  collection(idOrName: 'products'): RecordService<Product>
  collection(idOrName: 'categories'): RecordService<Category>
  collection(idOrName: 'orders'): RecordService<Order>
  collection(idOrName: 'order_items'): RecordService<OrderItem>
  collection(idOrName: 'users'): RecordService<User>
  collection(idOrName: 'announcements'): RecordService<Announcement>
  collection(idOrName: 'addon_groups'): RecordService<AddonGroup>
  collection(idOrName: 'addons'): RecordService<Addon>
  collection(idOrName: 'product_addons'): RecordService<ProductAddon>
  collection(idOrName: 'order_item_addons'): RecordService<OrderItemAddon>
  collection(idOrName: 'cart'): RecordService<CartItem>
}

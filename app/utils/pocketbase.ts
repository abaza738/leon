import type PocketBase from 'pocketbase'
import type {RecordModel} from 'pocketbase'

/**
 * Get file URL from PocketBase record
 */
export const getFileUrl = (
  record: RecordModel,
  filename: string,
  fallback?: string
): string | undefined => {
  try {
    if (!record || !filename) return fallback
    const {$pb} = useNuxtApp()
    return $pb.files.getURL(record, filename)
  } catch (error) {
    console.warn('Failed to get file URL:', error)
    return fallback
  }
}

/**
 * Execute batch operations of mixed types (create, update, delete)
 */
export const executeBatchOperations = async (
  pb: PocketBase,
  operations: Array<{
    type: 'create' | 'update' | 'delete'
    collection: string
    id?: string
    data?: Record<string, any>
  }>
) => {
  if (operations.length === 0) return

  const batch = pb.createBatch()

  operations.forEach((op) => {
    switch (op.type) {
      case 'create':
        batch.collection(op.collection).create(op.data || {})
        break
      case 'update':
        if (op.id) {
          batch.collection(op.collection).update(op.id, op.data || {})
        }
        break
      case 'delete':
        if (op.id) {
          batch.collection(op.collection).delete(op.id)
        }
        break
    }
  })

  return await batch.send()
}

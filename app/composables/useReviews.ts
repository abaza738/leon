export function useReviews() {
  const {$pb} = useNuxtApp()
  const {success} = useToast()
  const {userId} = useAuth()

  if (!userId.value) {
    throw new Error('Authentication required')
  }

  const getProductReviews = (productId: string) =>
    useAsyncData(`product-reviews-${productId}`, () =>
      $pb.collection('reviews').getList(1, 50, {
        filter: `product="${productId}"`,
        sort: '-created',
        expand: 'customer'
      })
    )

  async function createReview(reviewData: {
    order: string
    product: string
    rating: number
    title?: string
    comment?: string
  }) {
    const review = await $pb
      .collection('reviews')
      .create({customer: userId.value, ...reviewData, helpful_count: 0})

    success('Review submitted successfully!')
    return review
  }

  const getExistingReview = (orderId: string, productId: string) =>
    useAsyncData(`existing-review-${orderId}-${productId}`, async () => {
      return await $pb
        .collection('reviews')
        .getFirstListItem(
          `order="${orderId}" && product="${productId}" && customer="${userId.value}"`
        )
    })

  // Get all existing reviews for an order (returns Set of reviewed product IDs)
  const getOrderReviews = (orderId: string) =>
    useAsyncData(`order-reviews-${orderId}`, async () => {
      if (!userId.value) return new Set()

      try {
        // Get all reviews for this order and customer
        const reviews = await $pb.collection('reviews').getFullList({
          filter: `order="${orderId}" && customer="${userId.value}"`
        })

        // Return a Set of reviewed product IDs
        return new Set(reviews.map((review) => review.product).filter(Boolean))
      } catch (error) {
        console.error('Error loading reviews:', error)
        return new Set()
      }
    })

  // Calculate review statistics - simplified to work with any review data
  const calculateReviewStats = (reviews: any[]) => {
    const totalReviews = reviews.length

    if (!totalReviews) {
      return {
        averageRating: 0,
        totalReviews: 0,
        ratingDistribution: {5: 0, 4: 0, 3: 0, 2: 0, 1: 0}
      }
    }

    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0)
    const averageRating = Math.round((totalRating / totalReviews) * 10) / 10

    const ratingDistribution = reviews.reduce(
      (acc, review) => {
        acc[review.rating as keyof typeof acc]++
        return acc
      },
      {5: 0, 4: 0, 3: 0, 2: 0, 1: 0}
    )

    return {averageRating, totalReviews, ratingDistribution}
  }

  return {
    getProductReviews,
    createReview,
    getExistingReview,
    getOrderReviews,
    calculateReviewStats
  }
}

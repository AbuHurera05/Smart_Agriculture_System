// // ---------------------------------------------------------------------------
// // marketplace-service returns category/status as uppercase enum names
// // (e.g. "PRODUCE", "PENDING") and BigDecimal amounts as JSON numbers/strings.
// // These helpers translate its ProductResponse/OrderResponse shapes into what
// // Marketplace.jsx already renders, and normalize outgoing category values.
// // ---------------------------------------------------------------------------

// const emojiByCategory = {
//   produce: '🌾',
//   seeds: '🌱',
//   fertilizers: '🧪',
//   equipment: '🚜',
//   tools: '🛠️',
//   livestock: '🐄',
// }

// // "PENDING" -> "Pending" (order status enum names -> the Capitalized labels
// // the UI already uses for orderStatusColor / the status <select>)
// export const titleCase = (value) =>
//   value ? value.charAt(0).toUpperCase() + value.slice(1).toLowerCase() : value

// // ProductResponse -> the shape ProductCard / Marketplace.jsx render.
// export const productFromResponse = (p) => ({
//   id: p.id,
//   sellerId: p.sellerId, // this is the SellerProfile id, matches OrderRequest.sellerId
//   sellerName: p.sellerShopName,
//   title: p.title,
//   description: p.description || '',
//   category: (p.category || '').toLowerCase(),
//   price: p.price != null ? Number(p.price) : 0,
//   unit: p.unit,
//   stock: p.stock ?? 0,
//   rating: p.rating ?? 0,
//   reviewsCount: p.reviewsCount ?? 0,
//   organic: !!p.organic,
//   negotiable: !!p.negotiable,
//   imageUrl: p.imageUrl || null,
//   image: emojiByCategory[(p.category || '').toLowerCase()] || '📦',
//   status: p.status,
//   createdAt: p.createdAt,
// })

// // UI product form -> ProductRequest body for POST/PUT /marketplace/products.
// export const productToRequest = (form) => ({
//   title: form.title,
//   description: form.description,
//   category: form.category,
//   price: Number(form.price),
//   unit: form.unit,
//   stock: Number(form.stock),
//   organic: !!form.organic,
//   negotiable: !!form.negotiable,
//   imageUrl: form.imageUrl || undefined,
// })

// // OrderResponse -> the shape OrdersList / Marketplace.jsx render.
// export const orderFromResponse = (o) => ({
//   id: o.id,
//   displayId: `ORD-${o.id}`,
//   buyerId: o.buyerId,
//   sellerId: o.sellerId,
//   sellerName: o.sellerShopName,
//   status: titleCase(o.status),
//   totalAmount: o.totalAmount != null ? Number(o.totalAmount) : 0,
//   deliveryAddress: o.deliveryAddress,
//   items: (o.items || []).map((i) => ({
//     productId: i.productId,
//     title: i.title,
//     qty: i.quantity,
//     unit: i.unit,
//     price: i.price != null ? Number(i.price) : 0,
//   })),
//   orderDate: o.orderDate ? new Date(o.orderDate).toISOString().split('T')[0] : '',
// })

// ---------------------------------------------------------------------------
// marketplace-service returns category/status as uppercase enum names
// (e.g. "PRODUCE", "PENDING") and BigDecimal amounts as JSON numbers/strings.
// These helpers translate its ProductResponse/OrderResponse/SellerProfileResponse
// shapes into what the Marketplace pages render, and normalize outgoing
// category/order-request values.
//
// IMPORTANT: every "extra" field below (sellerVerified, sellerLocation,
// images, video, specifications, ...) is read straight from the API
// response with a safe fallback. Nothing here invents data — if the
// backend doesn't send a field yet, the corresponding UI element simply
// doesn't render (see ProductCard / ProductDetail).
// ---------------------------------------------------------------------------

const emojiByCategory = {
  produce: '🌾',
  seeds: '🌱',
  fertilizers: '🧪',
  pesticides: '🧴',
  equipment: '🚜',
  tools: '🛠️',
  livestock: '🐄',
}

export const categoryEmoji = (category) => emojiByCategory[(category || '').toLowerCase()] || '📦'

// "PENDING" -> "Pending" (order status enum names -> the Capitalized labels
// the UI already uses for orderStatusColor / the status <select>)
export const titleCase = (value) =>
  value ? value.charAt(0).toUpperCase() + value.slice(1).toLowerCase() : value

// ProductResponse -> the shape ProductCard / ProductDetail / Marketplace render.
export const productFromResponse = (p) => ({
  id: p.id,
  sellerId: p.sellerId, // SellerProfile id, matches OrderRequest.sellerId
  sellerName: p.sellerShopName,
  // Optional seller/location metadata — only shown if the backend sends it.
  sellerVerified: p.sellerVerified ?? undefined,
  sellerLocation: p.sellerLocation || p.location || undefined,
  sellerRating: p.sellerRating ?? undefined,
  title: p.title,
  description: p.description || '',
  category: (p.category || '').toLowerCase(),
  price: p.price != null ? Number(p.price) : 0,
  originalPrice: p.originalPrice != null ? Number(p.originalPrice) : undefined,
  unit: p.unit,
  stock: p.stock ?? 0,
  rating: p.rating ?? 0,
  reviewsCount: p.reviewsCount ?? 0,
  organic: !!p.organic,
  negotiable: !!p.negotiable,
  imageUrl: p.imageUrl || null,
  images: Array.isArray(p.images) && p.images.length ? p.images : (p.imageUrl ? [p.imageUrl] : []),
  videoUrl: p.videoUrl || undefined,
  image: categoryEmoji(p.category),
  status: p.status,
  createdAt: p.createdAt,
  // Free-form agricultural specification bag (crop, variety, NPK, activeIngredient, ...).
  // Only rendered where present — see AgriSpecs in ProductDetail.jsx.
  specifications: p.specifications || null,
})

// UI product form -> ProductRequest body for POST/PUT /marketplace/products.
export const productToRequest = (form) => ({
  title: form.title,
  description: form.description,
  category: form.category,
  price: Number(form.price),
  unit: form.unit,
  stock: Number(form.stock),
  organic: !!form.organic,
  negotiable: !!form.negotiable,
  imageUrl: form.imageUrl || undefined,
  ...(form.originalPrice ? { originalPrice: Number(form.originalPrice) } : {}),
  ...(form.specifications && Object.keys(form.specifications).length
    ? { specifications: form.specifications }
    : {}),
})

// OrderResponse -> the shape OrdersList / OrderTimeline / Marketplace render.
export const orderFromResponse = (o) => ({
  id: o.id,
  displayId: `ORD-${o.id}`,
  buyerId: o.buyerId,
  sellerId: o.sellerId,
  sellerName: o.sellerShopName,
  status: titleCase(o.status),
  totalAmount: o.totalAmount != null ? Number(o.totalAmount) : 0,
  deliveryAddress: o.deliveryAddress,
  paymentMethod: o.paymentMethod || undefined,
  items: (o.items || []).map((i) => ({
    productId: i.productId,
    title: i.title,
    qty: i.quantity,
    unit: i.unit,
    price: i.price != null ? Number(i.price) : 0,
  })),
  orderDate: o.orderDate ? new Date(o.orderDate).toISOString().split('T')[0] : '',
})

// Cart items grouped by seller -> one OrderRequest body per seller.
// (Multiple sellers in the cart => multiple POST /marketplace/orders calls.)
// `deliveryMethod` is sent as an extra field for forward-compatibility with
// the backend; if the current OrderRequest DTO doesn't have it yet, Jackson
// will simply ignore the unknown property rather than fail the request.
export const cartGroupToOrderRequest = (sellerId, items, address, deliveryMethod) => ({
  sellerId,
  items: items.map((i) => ({ productId: i.productId, quantity: i.qty })),
  deliveryAddress: address,
  ...(deliveryMethod ? { deliveryMethod } : {}),
})

// SellerProfileResponse -> the shape SellerStore.jsx renders.
export const sellerFromResponse = (s) => ({
  id: s.id,
  shopName: s.shopName,
  description: s.description || '',
  location: s.location || '',
  verified: !!s.verified,
  rating: s.rating ?? 0,
  reviewsCount: s.reviewsCount ?? 0,
  followerCount: s.followerCount ?? undefined,
  logoUrl: s.logoUrl || null,
  sellerType: s.sellerType || undefined,
})
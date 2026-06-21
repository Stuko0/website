export interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image?: string
}

const CART_KEY = 'delcarpio_cart'

export const getCart = (): CartItem[] => {
  if (typeof window === 'undefined') return []
  const stored = localStorage.getItem(CART_KEY)
  return stored ? JSON.parse(stored) : []
}

export const saveCart = (items: CartItem[]) => {
  if (typeof window === 'undefined') return
  localStorage.setItem(CART_KEY, JSON.stringify(items))
  window.dispatchEvent(new CustomEvent('cart-updated', { detail: items }))
}

export const addToCart = (item: Omit<CartItem, 'quantity'>) => {
  const cart = getCart()
  const existing = cart.find(i => i.id === item.id)
  
  if (existing) {
    existing.quantity += 1
  } else {
    cart.push({ ...item, quantity: 1 })
  }
  
  saveCart(cart)
}

export const updateQuantity = (id: string, quantity: number) => {
  const cart = getCart()
  const item = cart.find(i => i.id === id)
  
  if (item) {
    if (quantity <= 0) {
      removeFromCart(id)
    } else {
      item.quantity = quantity
      saveCart(cart)
    }
  }
}

export const removeFromCart = (id: string) => {
  const cart = getCart().filter(i => i.id !== id)
  saveCart(cart)
}

export const clearCart = () => {
  saveCart([])
}

export const getCartTotal = (): number => {
  return getCart().reduce((sum, item) => sum + item.price * item.quantity, 0)
}

export const getCartCount = (): number => {
  return getCart().reduce((sum, item) => sum + item.quantity, 0)
}

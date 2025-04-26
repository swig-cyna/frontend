import { create } from "zustand"
import { persist } from "zustand/middleware"

// Fonction utilitaire pour recalculer les totaux
const recalculateTotals = (cartItems) => {
  const result = cartItems.reduce(
    (acc, item) => {
      const price = Number(item.price)
      const quantity = Number(item.quantity)
      acc.totalPrice += price * quantity
      acc.totalQuantity += quantity

      return acc
    },
    { totalPrice: 0, totalQuantity: 0 },
  )
  result.totalPrice = Math.round(result.totalPrice * 100) / 100

  return result
}

const useCartStore = create(
  persist(
    (set) => ({
      cartItems: [],
      totalQuantity: 0,
      totalPrice: 0,

      addItem: (item) => {
        const itemToAdd = {
          ...item,
          price: Number(item.price),
          quantity: item.quantity !== undefined ? Number(item.quantity) : 1,
        }

        set((state) => {
          const existingItemIndex = state.cartItems.findIndex(
            (i) => i.id === itemToAdd.id,
          )

          let updatedItems = []

          if (existingItemIndex < 0) {
            updatedItems = [...state.cartItems, itemToAdd]
          } else {
            updatedItems = [...state.cartItems]
            updatedItems[existingItemIndex].quantity += itemToAdd.quantity
          }

          const totals = recalculateTotals(updatedItems)

          return {
            cartItems: updatedItems,
            ...totals,
          }
        })
      },

      removeItem: (itemId) => {
        set((state) => {
          const updatedItems = state.cartItems.filter(
            (item) => item.id !== itemId,
          )

          const totals = recalculateTotals(updatedItems)

          return {
            cartItems: updatedItems,
            ...totals,
          }
        })
      },

      updateQuantity: (itemId, newQuantity = 1) => {
        const quantity = Number(newQuantity)

        set((state) => {
          const itemIndex = state.cartItems.findIndex(
            (item) => item.id === itemId,
          )

          if (itemIndex < 0) {
            return state
          }

          const updatedItems = [...state.cartItems]
          updatedItems[itemIndex] = {
            ...updatedItems[itemIndex],
            quantity,
          }

          const totals = recalculateTotals(updatedItems)

          return {
            cartItems: updatedItems,
            ...totals,
          }
        })
      },

      clearCart: () => {
        set(() => ({
          cartItems: [],
          totalQuantity: 0,
          totalPrice: 0,
        }))
      },
    }),
    {
      name: "cart-storage",
    },
  ),
)

export default useCartStore

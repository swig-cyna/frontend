import { create } from "zustand"
import { persist } from "zustand/middleware"

const useCartStore = create(
  persist(
    (set) => ({
      cartItems: [],
      totalQuantity: 0,
      totalPrice: 0,

      addItem: (item) => {
        const itemToAdd = {
          ...item,
          quantity: item.quantity !== undefined ? item.quantity : 1,
        }

        set((state) => {
          const existingItemIndex = state.cartItems.findIndex(
            (i) => i.id === itemToAdd.id
          )

          if (existingItemIndex < 0) {
            return {
              cartItems: [...state.cartItems, itemToAdd],
              totalQuantity: state.totalQuantity + itemToAdd.quantity,
              totalPrice:
                state.totalPrice + itemToAdd.price * itemToAdd.quantity,
            }
          }

          const updatedItems = [...state.cartItems]
          updatedItems[existingItemIndex].quantity += itemToAdd.quantity

          return {
            cartItems: updatedItems,
            totalQuantity: state.totalQuantity + itemToAdd.quantity,
            totalPrice: state.totalPrice + itemToAdd.price * itemToAdd.quantity,
          }
        })
      },

      removeItem: (itemId) => {
        set((state) => {
          const itemToRemove = state.cartItems.find(
            (item) => item.id === itemId
          )

          if (!itemToRemove) {
            return state
          }

          const updatedItems = state.cartItems.filter(
            (item) => item.id !== itemId
          )

          return {
            cartItems: updatedItems,
            totalQuantity: state.totalQuantity - itemToRemove.quantity,
            totalPrice:
              state.totalPrice - itemToRemove.price * itemToRemove.quantity,
          }
        })
      },

      updateQuantity: (itemId, newQuantity = 1) => {
        // Définir la quantité par défaut à 1 si elle n'est pas spécifiée
        const quantity = newQuantity !== undefined ? newQuantity : 1

        set((state) => {
          const itemIndex = state.cartItems.findIndex(
            (item) => item.id === itemId
          )

          if (itemIndex < 0) {
            return state
          }

          const item = state.cartItems[itemIndex]
          const quantityDifference = quantity - item.quantity
          const updatedItems = [...state.cartItems]
          updatedItems[itemIndex] = {
            ...item,
            quantity,
          }

          return {
            cartItems: updatedItems,
            totalQuantity: state.totalQuantity + quantityDifference,
            totalPrice: state.totalPrice + item.price * quantityDifference,
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
    }
  )
)

export default useCartStore

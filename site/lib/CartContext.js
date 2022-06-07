import { createContext, useState } from 'react'
import { useContext } from 'react'

/*const cart = {
    items: {
      idUUID: {
        quantity: 10,
        subtotal: 10
      }
    },
    addToCart: (id, data) => 10,
    removeFromCart: id => 10,
    size: 0,
    subtotal: 10
  }*/

export const CartContext = createContext({})

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState({})
  const addToCart = product => {
    setItems(current => {
      return {
        ...current,
        [product.id]: product
      }
    })
  }
  const size = Object.keys(items).length

  return (
    <CartContext.Provider value={{ items, addToCart, size }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const cart = useContext(CartContext)
  return cart
}

import { createContext, useState } from 'react'
import { useContext } from 'react'

export const CartContext = createContext({})

export const CartProvider = ({ children }) => {
  const [count, setCount] = useState(0)
  return (
    <CartContext.Provider value={{ total: count, setCount }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const cart = useContext(CartContext)
  return cart
}

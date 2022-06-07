import { createContext, useState } from 'react'
import { useContext } from 'react'
import { useEffect } from 'react'

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
  useEffect(() => {
    const loadedCart = localStorage.getItem('cart')
    if (loadedCart) {
      setItems(JSON.parse(loadedCart))
    }
  }, [])
  const addToCart = (product, selectedVariation) => {
    const variation = selectedVariation[0]
    const variationId = variation.optionName1 + variation.optionName2
    console.log(variation)
    setItems(current => {
      const newCart = { ...current }
      if (current[product.id]) {
        if (current[product.id].qtd[variationId]) {
          //produto existe no carrinho, variacao existe no carrinho
          current[product.id].qtd[variationId].qtd++
        } else {
          // produto existe no carrinho, variacao nao existe
          current[product.id].qtd = {
            ...current[product.id].qtd,
            [variationId]: {
              variation,
              qtd: 1
            }
          }
        }
      } else {
        newCart[product.id] = {
          product,
          qtd: {
            [variationId]: {
              variation,
              qtd: 1
            }
          }
        }
      }

      localStorage.setItem('cart', JSON.stringify(newCart))
      return newCart
    })
  }
  const removeFromCart = product => {
    const id = product.id
    setItems(current => {
      const { [id]: etc, ...newCart } = current
      localStorage.setItem('cart', JSON.stringify(newCart))
      return newCart
    })
  }
  const size = Object.keys(items).length

  return (
    <CartContext.Provider value={{ items, addToCart, size, removeFromCart }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const cart = useContext(CartContext)
  return cart
}

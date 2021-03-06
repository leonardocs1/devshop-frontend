import React from 'react'
import Link from 'next/link'

const Button = ({ children, type, ...props }) => {
  return (
    <button
      className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
      type={type}
      {...props}
    >
      {children}
    </button>
  )
}
const ButtonLink = ({ href, children }) => {
  return (
    <Link href={href}>
      <a className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'>
        {children}
      </a>
    </Link>
  )
}
const ButtonLinkOutline = ({ href, children }) => {
  return (
    <Link href={href}>
      <a className='bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded'>
        {children}
      </a>
    </Link>
  )
}
Button.Link = ButtonLink
Button.LinkOutLine = ButtonLinkOutline
export default Button

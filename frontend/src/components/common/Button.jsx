import React from 'react'

export default function Button({ children, type = 'button', onClick, variant = 'primary', className = '', ...rest }) {
  const base = 'inline-flex items-center justify-center font-semibold transition-colors focus:outline-none'
  const sizes = 'px-4 py-2 text-sm rounded-lg'

  const variants = {
    primary: 'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white shadow-md',
    solidBlack: 'bg-black text-white shadow',
    secondary: 'bg-gray-200 text-gray-700 hover:bg-gray-300',
    outline: 'border border-gray-200 text-gray-700 hover:bg-gray-50'
  }

  const variantClass = variants[variant] || variants.primary

  return (
    <button type={type} onClick={onClick} className={`${base} ${sizes} ${variantClass} ${className}`} {...rest}>
      {children}
    </button>
  )
}

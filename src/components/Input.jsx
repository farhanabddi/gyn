import React from 'react'

export default function Input({value, onChange, placeholder = '', className = '', type = 'text'}){
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`border rounded px-3 py-2 ${className}`}
    />
  )
}

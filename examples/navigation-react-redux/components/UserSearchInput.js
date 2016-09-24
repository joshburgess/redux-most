import React from 'react'

const UserSearchInput = ({ value, defaultValue, onChange }) => {
  const handleOnChange = evt => onChange(evt.target.value)
  return (
    <input
      type='text'
      placeholder='Search for a GH user'
      defaultValue={defaultValue}
      onChange={handleOnChange}
    />
  )
}

export default UserSearchInput

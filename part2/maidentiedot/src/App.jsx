import React, { useState } from 'react'
import countriesService from './services/Countries'

const FilterForm = ({ searchValue, handleSearchChange }) => {
  return (
    <div>
      find countries
      <input
        value={searchValue}
        onChange={handleSearchChange}
      />
    </div>
  )
}

const Countries = ({ countries, searchValue}) => {
  const filteredItems = countries.filter((country) =>
    country.name.toLowerCase().includes(searchValue.toLowerCase()
    ))

    return (
      <div>
        {filteredItems.map((country) => (
          <div key={country.name}>
            {country.name}
          </div>
        ))}
      </div>
    )
  }

const App = () => {
  const [searchValue, setSearchValue] = useState('')

  const handleSearchChange = (event) => {
    const searchInput = event.target.value
    setSearchValue(searchInput)
  }

  return (
    <div>
      <FilterForm searchValue={searchValue} handleSearchChange={handleSearchChange} />
      <Countries countries={country} searchValue={searchValue}/>
    </div>
  )
}

export default App
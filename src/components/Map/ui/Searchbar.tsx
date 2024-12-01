import { useCallback, useState } from 'react'
import { LatLngExpression } from 'leaflet'

import useMapContext from '../useMapContext'

export const SearchBar = () => {
  const { map } = useMapContext()
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)

  const handleSearch = useCallback(async () => {
    if (!searchQuery) {
      setError('Please enter a location')
      return
    }

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`
      )
      const data = await response.json()

      if (data && data.length > 0) {
        setSearchResults(data)
        const { lat, lon } = data[0]
        const position: LatLngExpression = [parseFloat(lat), parseFloat(lon)]
        map?.flyTo(position, 12, { animate: true })
      } else {
        setError('No results found!')
      }
    } catch (err) {
      setError('An error occurred while searching')
    }
  }, [searchQuery, map])

  const handleResultClick = useCallback(
    (result) => {
      const position: LatLngExpression = [parseFloat(result.lat), parseFloat(result.lon)]
      map?.flyTo(position, 12, { animate: true })
      setSearchQuery('')
      setSearchResults([])
    },
    [map]
  )

  return (
    <div className="absolute top-4 left-4 z-400 w-80 bg-white shadow-md p-4 rounded-md">
      <div className="flex flex-col space-y-2">
        <input
          type="text"
          placeholder="Search for a location"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value)
            setError(null)
          }}
          className="p-2 border border-gray-300 rounded-md w-full"
        />
        <button
          onClick={handleSearch}
          className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Search
        </button>
        {error && <div className="text-red-500 text-sm">{error}</div>}
        {searchResults.length > 0 && (
          <ul className="bg-gray-100 rounded-md shadow-inner p-2 space-y-1 max-h-40 overflow-y-auto">
            {searchResults.map((result, index) => (
              <li
                key={index}
                onClick={() => handleResultClick(result)}
                className="p-2 bg-white rounded-md hover:bg-blue-100 cursor-pointer"
              >
                {result.display_name}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

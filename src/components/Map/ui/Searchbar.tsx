import { LatLngExpression } from 'leaflet'
import { useCallback, useState } from 'react'

import useMapContext from '../useMapContext'

interface SearchResult {
  lat: string // Assuming latitude is a string
  lon: string // Assuming longitude is a string
}

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
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`,
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
    (result: SearchResult) => {
      const position: LatLngExpression = [parseFloat(result.lat), parseFloat(result.lon)]
      map?.flyTo(position, 12, { animate: true })
      setSearchQuery('')
      setSearchResults([])
    },
    [map],
  )

  return (
    <div className=" z-400 w-80 rounded-md bg-white p-4 shadow-md">
      <div className="flex flex-col space-y-2">
        <input
          type="text"
          placeholder="Search for a location"
          value={searchQuery}
          onChange={e => {
            setSearchQuery(e.target.value)
            setError(null)
          }}
          className="w-full rounded-md border border-gray-300 p-2"
        />
        <button onClick={handleSearch} className="rounded-md bg-blue-500 p-2 text-white hover:bg-blue-600">
          Search
        </button>
        {error && <div className="text-sm text-red-500">{error}</div>}
        {searchResults.length > 0 && (
          <ul className="max-h-40 space-y-1 overflow-y-auto rounded-md bg-gray-100 p-2 shadow-inner">
            {searchResults.map((result, index) => (
              <li
                key={index}
                onClick={() => handleResultClick(result)}
                className="cursor-pointer rounded-md bg-white p-2 hover:bg-blue-100"
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

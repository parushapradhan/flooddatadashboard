import { useState, useCallback } from 'react'
import { LatLngExpression } from 'leaflet'

import useMapContext from '../useMapContext'

interface District {
  name: string
  lat: number
  lon: number
}

const districts: District[] = [
  { name: 'Kathmandu', lat: 27.7172, lon: 85.3240 },
  { name: 'Pokhara', lat: 28.2096, lon: 83.9856 },
  { name: 'Biratnagar', lat: 26.4833, lon: 87.2833 },
  { name: 'Lalitpur', lat: 27.6725, lon: 85.3294 },
  { name: 'Bhaktapur', lat: 27.6710, lon: 85.4298 },
  // Add more districts as needed
]

export const FilterComponent = () => {
  const { map, setDistrict } = useMapContext();
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [filteredDistricts, setFilteredDistricts] = useState<District[]>(districts)

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query)

    if (query.trim() === '') {
      setFilteredDistricts(districts)
    } else {
      const results = districts.filter(district =>
        district.name.toLowerCase().includes(query.toLowerCase())
      )
      setFilteredDistricts(results)
    }
  }, [])

  const handleDistrictClick = useCallback(
    (district: District) => {
      const position: LatLngExpression = [district.lat, district.lon]
      if (district.name) {
        // Ensure setDistrict is defined before calling it
        if (setDistrict) {
          setDistrict(district.name);
        } else {
          console.error('setDistrict is undefined');
        }
      }
      map?.flyTo(position, 12, { animate: true })
      console.log(district.name)
      setSearchQuery('')
      setFilteredDistricts(districts)
    },
    [map,setDistrict]
  )

  return (
    <div className=" w-80 bg-white shadow-md p-4 rounded-md">
      <div className="flex flex-col space-y-2">
        <input
          type="text"
          placeholder="Search for a district"
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          className="p-2 border border-gray-300 rounded-md w-full"
        />
        {filteredDistricts.length > 0 && (
          <ul className="bg-gray-100 rounded-md shadow-inner p-2 space-y-1 max-h-40 overflow-y-auto">
            {filteredDistricts.map((district, index) => (
              <li
                key={index}
                onClick={() => handleDistrictClick(district)}
                className="p-2 bg-white rounded-md hover:bg-blue-100 cursor-pointer"
              >
                {district.name}
              </li>
            ))}
          </ul>
        )}
        {filteredDistricts.length === 0 && (
          <div className="text-gray-500 text-sm">No districts found</div>
        )}
      </div>
    </div>
  )
}

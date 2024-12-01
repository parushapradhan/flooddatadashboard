import { useContext } from 'react'

import { MapContext } from './LeafletMapContextProvider'

const useMapContext = () => {
  const mapInstance = useContext(MapContext)
  const map = mapInstance?.map
  const setMap = mapInstance?.setMap
  const leafletLib = mapInstance?.leafletLib
  const setLeafletLib = mapInstance?.setLeafletLib
  const district = mapInstance?.district
  const filters = mapInstance?.filterQuery
  const setDistrict = mapInstance?.setDistrict
  const setFilterQuery = mapInstance?.setFilterQuery
  return { map, setMap, leafletLib, setLeafletLib, district, filters, setDistrict, setFilterQuery }
}

export default useMapContext

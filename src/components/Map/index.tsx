import { Stack } from '@mui/material'
import Grid from '@mui/material/Grid2'
import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import { useResizeDetector } from 'react-resize-detector'

import { AppConfig } from '#lib/AppConfig'
import MarkerCategories, { Category } from '#lib/MarkerCategories'
import { fetchPlaces, Places, PlaceValues } from '#lib/Places'

import { Legend } from './LeafletLegend'
import LeafleftMapContextProvider from './LeafletMapContextProvider'
import ClimateData from './ui/ClimateData'
import { FilterComponent } from './ui/DistrictMenu'
import { SearchBar } from './ui/Searchbar'
import useMapContext from './useMapContext'
import useMarkerData from './useMarkerData'

const LeafletCluster = dynamic(async () => (await import('./LeafletCluster')).LeafletCluster(), {
  ssr: false,
})
const CenterToMarkerButton = dynamic(async () => (await import('./ui/CenterButton')).CenterButton, {
  ssr: false,
})
const CustomMarker = dynamic(async () => (await import('./LeafletMarker')).CustomMarker, {
  ssr: false,
})
const LocateButton = dynamic(async () => (await import('./ui/LocateButton')).LocateButton, {
  ssr: false,
})
const LeafletMapContainer = dynamic(async () => (await import('./LeafletMapContainer')).LeafletMapContainer, {
  ssr: false,
})

const LeafletMapInner = () => {
  const { map, district } = useMapContext()
  console.log('map district', district)
  const {
    width: viewportWidth,
    height: viewportHeight,
    ref: viewportRef,
  } = useResizeDetector({
    refreshMode: 'debounce',
    refreshRate: 200,
  })

  const [places, setPlaces] = useState<PlaceValues[]>([])
  const [isLoadingPlaces, setIsLoadingPlaces] = useState(true)

  const { clustersByCategory, allMarkersBoundCenter } = useMarkerData({
    locations: Places, // Use the dynamically fetched places
    map,
    viewportWidth,
    viewportHeight,
  })

  const isLoading = !map || !viewportWidth || !viewportHeight

  /** Fetch places and watch position & zoom of all markers */
  useEffect(() => {
    // const loadPlaces = async () => {
    //   try {
    //     const data = await fetchPlaces(); // Fetch places dynamically
    //     setPlaces(data);
    //   } catch (error) {
    //     console.error('Error loading places:', error);
    //   } finally {
    //     setIsLoadingPlaces(false);
    //   }
    // };

    // loadPlaces();

    if (!allMarkersBoundCenter || !map) return

    const moveEnd = () => {
      map.off('moveend', moveEnd)
    }

    map.flyTo(allMarkersBoundCenter.centerPos, allMarkersBoundCenter.minZoom, { animate: false })
    map.once('moveend', moveEnd)
  }, [allMarkersBoundCenter, map])

  return (
    <div>
      <Grid container spacing={2}>
        <Grid size={9}>
          <div
            ref={viewportRef}
            key={district}
            className={`transition-opacity ${isLoading ? 'opacity-0' : 'opacity-1'}`}
            style={{
              top: AppConfig.ui.topBarHeight,
              width: '100%',
              height: '90vh',
            }}
          >
            {allMarkersBoundCenter && clustersByCategory && (
              <LeafletMapContainer
                center={allMarkersBoundCenter.centerPos}
                zoom={allMarkersBoundCenter.minZoom}
                maxZoom={AppConfig.maxZoom}
                minZoom={AppConfig.minZoom}
              >
                {!isLoading ? (
                  <>
                    <CenterToMarkerButton
                      center={allMarkersBoundCenter.centerPos}
                      zoom={allMarkersBoundCenter.minZoom}
                    />
                    <LocateButton />
                    <Legend />
                    {Object.values(clustersByCategory).map(item => (
                      <LeafletCluster
                        key={item.category}
                        icon={MarkerCategories[item.category as Category].icon}
                        color={MarkerCategories[item.category as Category].color}
                        chunkedLoading
                      >
                        {item.markers.map(marker => (
                          <CustomMarker place={marker} key={marker.id} />
                        ))}
                      </LeafletCluster>
                    ))}
                  </>
                ) : (
                  <></>
                )}
              </LeafletMapContainer>
            )}
          </div>
        </Grid>
        <Grid size={3}>
          <Stack spacing={3}>
            <SearchBar />
            <FilterComponent />
            <ClimateData />
          </Stack>
        </Grid>
      </Grid>
    </div>
  )
}

// Pass through to get context in <MapInner>
const Map = () => (
  <LeafleftMapContextProvider>
    <LeafletMapInner />
  </LeafleftMapContextProvider>
)

export default Map

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import { useResizeDetector } from 'react-resize-detector'
import { AppConfig } from '#lib/AppConfig'
import MarkerCategories, { Category } from '#lib/MarkerCategories'
import { Places } from '#lib/Places'
import {  Stack } from '@mui/material';
import Grid from '@mui/material/Grid2';
import LeafleftMapContextProvider from './LeafletMapContextProvider'
import useMapContext from './useMapContext'
import useMarkerData from './useMarkerData'
import { SearchBar } from './ui/Searchbar';
import { FilterComponent } from './ui/DistrictMenu';
import { Legend } from './LeafletLegend'
import ClimateData from './ui/ClimateData'

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
  const { map } = useMapContext()
  const {
    width: viewportWidth,
    height: viewportHeight,
    ref: viewportRef,
  } = useResizeDetector({
    refreshMode: 'debounce',
    refreshRate: 200,
  })

  const { clustersByCategory, allMarkersBoundCenter } = useMarkerData({
    locations: Places,
    map,
    viewportWidth,
    viewportHeight,
  })

  const isLoading = !map || !viewportWidth || !viewportHeight

  /** watch position & zoom of all markers */
  useEffect(() => {
    if (!allMarkersBoundCenter || !map) return

    const moveEnd = () => {
      map.off('moveend', moveEnd)
    }

    map.flyTo(allMarkersBoundCenter.centerPos, allMarkersBoundCenter.minZoom, { animate: false })
    map.once('moveend', moveEnd)
  }, [allMarkersBoundCenter, map])

  return (
<div>
  {/* absolute h-full w-full overflow-hidden */}
  <Grid container spacing={2}>
        <Grid size={9}>
            <div
            ref={viewportRef}
            className={`transition-opacity ${isLoading ? 'opacity-0' : 'opacity-1 '}`}
            style={{
              top: AppConfig.ui.topBarHeight,
              width: '100%',
              height: '90vh'
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
                    <Legend/>
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
                  // we have to spawn at least one element to keep it happy
                  // eslint-disable-next-line react/jsx-no-useless-fragment
                  <></>
                )}
              </LeafletMapContainer>
            )}
          </div>
        </Grid>
        <Grid size={3}>
          <Stack spacing={3}>
            <SearchBar/>
            <FilterComponent/>
            {/* <ClimateData/> */}
          </Stack>

        </Grid>

  </Grid>
</div>

  )
}

// pass through to get context in <MapInner>
const Map = () => (
  <LeafleftMapContextProvider>
    <LeafletMapInner />
  </LeafleftMapContextProvider>
)

export default Map

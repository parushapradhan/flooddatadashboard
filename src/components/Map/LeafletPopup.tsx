import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import dynamic from 'next/dynamic'
import { Popup, PopupProps } from 'react-leaflet'

import { AppConfig } from '#lib/AppConfig'
import { MarkerCategoriesValues } from '#lib/MarkerCategories'
import { PlaceValues } from '#lib/Places'

const MarkerIconWrapper = dynamic(() => import('#src/components/Map/LeafletMarker/MarkerIconWrapper'))

const price = '20'

interface LeafletPopupProps extends PopupProps {
  handlePopupClose: (active?: boolean) => void
  handleOpenLocation: () => void
  item: PlaceValues
  color: MarkerCategoriesValues['color']
  icon: MarkerCategoriesValues['icon']
}

const LeafletPopup = ({
  handlePopupClose,
  handleOpenLocation,
  color,
  icon,
  item,
  ...props
}: LeafletPopupProps) => {
  const { title, address } = item

  return (
    <Popup {...props}>
      <div
        className="absolute rounded bg-white shadow"
        style={{
          // todo: rework the offsets at some point
          marginLeft: `calc(-150px + ${AppConfig.ui.markerIconSize - 5}px)`,

          // todo: some offest to align with the marker icon
          // marginTop: -6,
        }}
      >
        <div className="flex flex-row justify-center pt-3" style={{ width: '300px' }}>
          <div
            className="flex w-full flex-col justify-center p-3 pt-6 text-center"
            // style={{ marginTop: AppConfig.ui.markerIconSize * 2 + 8 }}
          >
            {/* Image Section */}
            <div style={{ position: 'relative', height: '150px', overflow: 'hidden' }}>
              <img
                src={item.image}
                alt={item.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div
                style={{
                  position: 'absolute',
                  top: '10px',
                  left: '10px',
                  backgroundColor: 'red',
                  padding: '5px 10px',
                  borderRadius: '4px',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  color: 'white',
                }}
              >
                High Risk
              </div>
            </div>

            {/* Content Section */}
            <div className="p-4">
              <div className="mb-1 text-lg font-bold">${price}/mo</div>
              <div className="mb-2 flex justify-between text-sm">
                <span>🏠 {item.bedrooms}bd</span>
                <span>🛁 {item.bathrooms}ba</span>
                <span>📏 {item.sqft} sqft</span>
                <span>📏 No of complaints: 10</span>
              </div>
              <div className="text-sm text-gray-600">{item.address}</div>
            </div>

            {/* button */}
            <div className="mt-6 flex flex-row justify-between gap-2 rounded p-2">
              <button
                className="bg-primary gap-2 rounded p-2 text-white"
                onClick={() => handleOpenLocation()}
              >
                View More Details
              </button>
            </div>
          </div>
        </div>
      </div>
    </Popup>
  )
}

export default LeafletPopup

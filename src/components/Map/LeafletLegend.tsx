import React, { useState } from 'react'

export const Legend = () => {
  const [isVisible, setIsVisible] = useState(false) // Toggle legend visibility

  const toggleLegend = () => {
    setIsVisible(prev => !prev)
  }

  return (
    <div style={{ zIndex: 400 }}>
      {/* Legend Toggle Button */}
      <button
        type="button"
        className={`absolute top-16 right-3 rounded bg-white p-2 shadow-md ${
          isVisible ? 'text-dark' : 'text-light'
        }`}
        onClick={toggleLegend}
      >
        Legend
      </button>

      {/* Legend Content */}
      {isVisible && (
        <div
          className="absolute bottom-2 right-3 rounded bg-white p-3 shadow-md"
          style={{
            zIndex: 400,
            minWidth: '150px',
          }}
        >
          <h4 className="mb-2 text-sm font-bold">Flood Severity</h4>
          <div className="mb-1 flex items-center">
            <span
              style={{
                display: 'inline-block',
                width: '16px',
                height: '16px',
                backgroundColor: 'red',
                marginRight: '8px',
                borderRadius: '2px',
              }}
            ></span>
            <span className="text-sm">High</span>
          </div>
          <div className="mb-1 flex items-center">
            <span
              style={{
                display: 'inline-block',
                width: '16px',
                height: '16px',
                backgroundColor: 'orange',
                marginRight: '8px',
                borderRadius: '2px',
              }}
            ></span>
            <span className="text-sm">Moderate</span>
          </div>
          <div className="flex items-center">
            <span
              style={{
                display: 'inline-block',
                width: '16px',
                height: '16px',
                backgroundColor: 'green',
                marginRight: '8px',
                borderRadius: '2px',
              }}
            ></span>
            <span className="text-sm">Low</span>
          </div>
        </div>
      )}
    </div>
  )
}

import { LatLngExpression } from 'leaflet'

import { Category } from './MarkerCategories'

export interface PlaceValues {
  id: number
  position: LatLngExpression
  category: Category
  title: string
  address: string
  bedrooms: number // Number of bedrooms
  bathrooms: number // Number of bathrooms
  sqft: number // Square footage
  image: string // URL to the image
}

export type PlacesType = PlaceValues[]
export type PlacesClusterType = Record<string, PlaceValues[]>

export const Places: PlacesType = [
  {
    id: 1,
    position: [27.7172, 85.324],
    category: Category.CAT1,
    title: '123 Main St',
    address: '123 Main St, Nepal',
    bedrooms: 3,
    bathrooms: 2,
    sqft: 1300,
    image:
      'https://images.unsplash.com/photo-1570129477492-45c003edd2be?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxMTkzNjJ8MHwxfGFsbHwxfHx8fHx8fHwxNjkzNDY0MDgw&ixlib=rb-1.2.1&q=80&w=400',
  },
  {
    id: 2,
    position: [28.3949, 84.124],
    category: Category.CAT1,
    title: '456 Elm St',
    address: '456 Elm St, Nepal',
    bedrooms: 4,
    bathrooms: 3,
    sqft: 1500,
    image:
      'https://images.unsplash.com/photo-1560185127-6e4f06b0a43e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxMTkzNjJ8MHwxfGFsbHwyfHx8fHx8fHwxNjkzNDY0MDgw&ixlib=rb-1.2.1&q=80&w=400',
  },
  {
    id: 3,
    position: [26.3967, 87.2718],
    category: Category.CAT1,
    title: '789 Oak St',
    address: '789 Oak St, Nepal',
    bedrooms: 2,
    bathrooms: 1,
    sqft: 900,
    image:
      'https://images.unsplash.com/photo-1600573476461-bad003dc27e3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxMTkzNjJ8MHwxfGFsbHwzfHx8fHx8fHwxNjkzNDY0MDgw&ixlib=rb-1.2.1&q=80&w=400',
  },
  {
    id: 4,
    position: [27.2528, 83.9722],
    category: Category.CAT1,
    title: '321 Pine St',
    address: '321 Pine St, Nepal',
    bedrooms: 3,
    bathrooms: 2,
    sqft: 1200,
    image:
      'https://images.unsplash.com/photo-1572120360610-d971b9b7889a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxMTkzNjJ8MHwxfGFsbHw0fHx8fHx8fHwxNjkzNDY0MDgw&ixlib=rb-1.2.1&q=80&w=400',
  },
  {
    id: 5,
    position: [29.0658, 82.1004],
    category: Category.CAT2,
    title: '654 Maple Ave',
    address: '654 Maple Ave, Nepal',
    bedrooms: 5,
    bathrooms: 4,
    sqft: 2000,
    image:
      'https://images.unsplash.com/photo-1560448204-e51f7c20300b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxMTkzNjJ8MHwxfGFsbHw1fHx8fHx8fHwxNjkzNDY0MDgw&ixlib=rb-1.2.1&q=80&w=400',
  },
  {
    id: 6,
    position: [27.5, 86.5],
    category: Category.CAT2,
    title: '987 Birch Rd',
    address: '987 Birch Rd, Nepal',
    bedrooms: 3,
    bathrooms: 2,
    sqft: 1400,
    image:
      'https://images.unsplash.com/photo-1599423300746-b62533397364?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxMTkzNjJ8MHwxfGFsbHw2fHx8fHx8fHwxNjkzNDY0MDgw&ixlib=rb-1.2.1&q=80&w=400',
  },
  {
    id: 7,
    position: [28.2, 84.0],
    category: Category.CAT2,
    title: '159 Cedar Blvd',
    address: '159 Cedar Blvd, Nepal',
    bedrooms: 4,
    bathrooms: 3,
    sqft: 1700,
    image:
      'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxMTkzNjJ8MHwxfGFsbHw3fHx8fHx8fHwxNjkzNDY0MDgw&ixlib=rb-1.2.1&q=80&w=400',
  },
  {
    id: 8,
    position: [28.61, 83.98],
    category: Category.CAT2,
    title: '753 Spruce Ct',
    address: '753 Spruce Ct, Nepal',
    bedrooms: 2,
    bathrooms: 1,
    sqft: 1000,
    image:
      'https://images.unsplash.com/photo-1590608897129-79da5a91b23a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxMTkzNjJ8MHwxfGFsbHw4fHx8fHx8fHwxNjkzNDY0MDgw&ixlib=rb-1.2.1&q=80&w=400',
  },
  {
    id: 9,
    position: [26.8103, 87.2764],
    category: Category.CAT2,
    title: '852 Walnut St',
    address: '852 Walnut St, Nepal',
    bedrooms: 3,
    bathrooms: 2,
    sqft: 1100,
    image:
      'https://images.unsplash.com/photo-1599423300746-b62533397364?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxMTkzNjJ8MHwxfGFsbHw5fHx8fHx8fHwxNjkzNDY0MDgw&ixlib=rb-1.2.1&q=80&w=400',
  },
  {
    id: 10,
    position: [28.2639, 83.9721],
    category: Category.CAT2,
    title: '246 Chestnut Dr',
    address: '246 Chestnut Dr, Nepal',
    bedrooms: 4,
    bathrooms: 3,
    sqft: 1600,
    image:
      'https://images.unsplash.com/photo-1568605114967-8130f3a36994?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxMTkzNjJ8MHwxfGFsbHwxMHx8fHx8fHwxNjkzNDY0MDgw&ixlib=rb-1.2.1&q=80&w=400',
  },
]

// Function to map flood risk to categories
const mapFloodRiskToCategory = (risk: string): Category => {
  switch (risk.toLowerCase()) {
    case 'low':
      return Category.CAT1
    case 'medium':
      return Category.CAT2
    case 'high':
      return Category.CAT3
    default:
      return Category.CAT1 // Default category
  }
}

// Fetch places from the database via an API
export const fetchPlaces = async (): Promise<PlacesType> => {
  try {
    const response = await fetch('/api/getPropertyData')

    if (!response.ok) {
      throw new Error('Failed to fetch property information')
    }

    const data = await response.json()

    return data.map((property: any) => ({
      id: property.property_id,
      position: JSON.parse(property.position),
      category: mapFloodRiskToCategory(property.current_flood_risk),
      title: property.address,
      address: property.address,
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      sqft: property.square_feet,
      image: property.image_url || 'https://via.placeholder.com/400',
    }))
  } catch (error) {
    console.error('Error fetching places:', error)
    return []
  }
}

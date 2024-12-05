export const Users = [
  {
    user_id: 1,
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone_number: '123-456-7890',
    password: 'hashed_password_1',
    created_at: '2023-01-01T12:00:00',
    year: 2023,
  },
  {
    user_id: 2,
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    phone_number: '987-654-3210',
    password: 'hashed_password_2',
    created_at: '2023-02-01T12:00:00',
    year: 2023,
  },
]

export const Owners = [
  {
    owner_id: 1,
    name: 'Alice Brown',
    phone_number: '555-111-2222',
    address: '123 Oak St',
    is_registered: true,
  },
  {
    owner_id: 2,
    name: 'Bob White',
    phone_number: '555-333-4444',
    address: '456 Pine St',
    is_registered: false,
  },
]

export const Properties = [
  {
    property_id: 1,
    address: '789 Maple St',
    position: [27.7172, 85.324],
    number_of_owners: 2,
    owner_id: 1,
    list_updated: '2023-03-01',
    current_flood_risk: 'Medium',
  },
  {
    property_id: 2,
    address: '101 Elm St',
    position: [27.715, 85.3201],
    number_of_owners: 1,
    owner_id: 2,
    list_updated: '2023-04-01',
    current_flood_risk: 'High',
  },
]

export const FloodRisks = [
  {
    risk_id: 1,
    property_id: 1,
    hazard_zone: 'Zone A',
    historical_floods: 3,
    insurance_required: true,
    predicted_risk_score: 7.5,
    year: 2023,
    source: 'www.floodsource.com',
  },
  {
    risk_id: 2,
    property_id: 2,
    hazard_zone: 'Zone B',
    historical_floods: 5,
    insurance_required: false,
    predicted_risk_score: 8.2,
    year: 2023,
    source: 'www.floodsource.com',
  },
]

export const FloodHistories = [
  {
    history_id: 1,
    property_id: 1,
    region_name: 'Kathmandu',
    latitude: 27.7172,
    longitude: 85.324,
    flood_risk_category: 'High',
    year: 2021,
    source: 'www.historysource.com',
    last_updated: '2023-03-01',
  },
  {
    history_id: 2,
    property_id: 2,
    region_name: 'Lalitpur',
    latitude: 27.6721,
    longitude: 85.3313,
    flood_risk_category: 'Medium',
    year: 2022,
    source: 'www.historysource.com',
    last_updated: '2023-04-01',
  },
]

export const FloodMitigations = [
  {
    measure_id: 1,
    property_id: 1,
    measure_type: 'Barrier',
    cost_usd: 5000,
  },
  {
    measure_id: 2,
    property_id: 2,
    measure_type: 'Drainage',
    cost_usd: 8000,
  },
]
export const EmergencyResources = [
  {
    resource_id: 1,
    resource_type: 'Shelter',
    latitude: 27.7,
    longitude: 85.3333,
    contact: '999-555-1212',
    capacity: 50,
    availability: true,
  },
  {
    resource_id: 2,
    resource_type: 'Rescue Boat',
    latitude: 27.7123,
    longitude: 85.3212,
    contact: '888-555-1212',
    capacity: 20,
    availability: false,
  },
]

export const ClimateData = [
  {
    climate_id: 1,
    region_name: 'Kathmandu',
    year: 2023,
    average_rainfall_mm: 1200.5,
    flood_likelihood: 0.75,
    temperature_c: 28.5,
    source: 'www.climatedata.com',
  },
  {
    climate_id: 2,
    region_name: 'Lalitpur',
    year: 2022,
    average_rainfall_mm: 1100.3,
    flood_likelihood: 0.65,
    temperature_c: 27.2,
    source: 'www.climatedata.com',
  },
]

export const DrainageInfrastructure = [
  {
    infrastructure_id: 1,
    region_name: 'Kathmandu',
    latitude: 27.7,
    longitude: 85.3,
    capacity_cubic_m: 1500.5,
    last_maintenance: '2022-12-01',
    source: 'www.infrastructure.com',
  },
  {
    infrastructure_id: 2,
    region_name: 'Lalitpur',
    latitude: 27.65,
    longitude: 85.31,
    capacity_cubic_m: 1800.7,
    last_maintenance: '2023-01-15',
    source: 'www.infrastructure.com',
  },
]

export const Notifications = [
  {
    notification_id: 1,
    property_id: 1,
    owner_id: 1,
    message: 'Flood risk alert: High risk in your area.',
    created_at: '2023-06-01T08:00:00',
    is_read: false,
  },
  {
    notification_id: 2,
    property_id: 2,
    owner_id: 2,
    message: 'Flood risk alert: Moderate risk in your area.',
    created_at: '2023-06-05T10:00:00',
    is_read: true,
  },
]

export const CommunityData = [
  {
    comment_id: 1,
    user_id: 1,
    property_id: 1,
    description: 'Flood mitigation measures needed in this area.',
  },
  {
    comment_id: 2,
    user_id: 2,
    property_id: 2,
    description: 'Drainage system maintenance overdue.',
  },
]

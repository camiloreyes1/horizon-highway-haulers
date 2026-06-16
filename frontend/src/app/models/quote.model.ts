export interface QuoteRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  vehicleMake: string;
  vehicleModel: string;
  vehicleYear: number;
  vehicleMileage: number;
  vin?: string;
  pickupLocation: string;
  dropOffLocation: string;
  shipDate: string;
  flexibility: 'exact' | '1-3days' | '1-week' | 'flexible';
  trailerType: 'open' | 'enclosed' | 'no-preference';
  notes?: string;
}

export interface QuoteRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  contactPref?: string;
  vehicleMake: string;
  vehicleModel: string;
  vehicleYear: number;
  vehicleType?: string;
  vehicleCondition?: string;
  vehicleMileage?: number;
  vin?: string;
  pickupLocation: string;
  dropOffLocation: string;
  shipDate: string;
  flexibility?: string;
  trailerType: string;
  notes?: string;
}

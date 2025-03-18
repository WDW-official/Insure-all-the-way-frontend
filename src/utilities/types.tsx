export type modalGenericType = {
  [key: string]: boolean;
};

export type requestType = {
  isLoading: boolean;
  data: any;
  error: any;
  id?: string;
};

export type insuranceTypes = {
  title: string;
  route: string;
  descriptions: string[] | null;
  list: null | string[];
  image: string;
  bgImage?: string;
};

export type navItemTypes = {
  title: string;
  route?: string;
  isActive?: boolean;
  description?: string;
  id: string;
  isBordered?: boolean;
};

export type tableOptionsType = {
  text: string;
  action: (insuranceId?: string) => void;
};

export type policyType = {
  id: string;
  name: string;
  types: policySubtypeType[];
};

export type policySubtypeType = {
  id: string;
  plans: policySubTypePlansType[];
  name: string;
  features: string[];
  description: string;
  price: string;
};

export type policySubTypePlansType = {
  name: string;
  price: number;
  features: string[];
  description: string;
};

export type thirdPartyInsuranceFormTypes = {
  product: string;
  registrationNumber: string;
  chasisNumber: string;
  vehicleColor: string;
  roadWorthiness: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  address: string;
  state: string;
  startDate: string;
  endDate: string;
};

export type enhancedThirdPartyInsuranceFormTypes = {
  makeOfVehicle: string;
  yearOfMake: string;
  modelOfVehicle: string;
  startDate: string;
  endDate: string;
  registrationNumber: string;
  engineNumber: string;
  chasisNumber: string;
  color: string;
  vehicleType: string;
  proofOfOwnership: null | File;
  plan: string;
  id: null | File;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  address: string;
  state: string;
  inspectionState: string;
  inspectionAddress: string;
  dateForInspection: string;
  contactName: string;
  contactPhone: string;
};

export type comprehensiveeFormDataTypes = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  state: string;
  registrationNumber: string;
  coverPeriod: string;
  vehicleValue: string;
  premium: string;
  startDate: string;
  endDate: string;
};

export type fleetFormDataTypes = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  state: string;
  address: string;
  propertyType: string;
  comment: string;
  startDate: string;
  endDate: string;
};

export type userType = {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  firstLogin?: string;
  address: string;
  state: string;
};

export type userPoliciesType = {
  chasisNumber: string;
  createdAt: string;
  endDate: string;
  insuranceType: string;
  plan: string;
  registrationNumber: string;
  roadWorthiness: string;
  startDate: string;
  user: string;
  _id: string;
  status: string;
  agent: userType;
  isTrackerInstalled?: boolean;
};

export type claimsDataType = {
  dateAndTime: string;
  registrationNumber: string;
  location: string;
  narration: string;
};

export type allRiskDataTypes = userType & {
  deviceType: string;
  valueOfDevice: string;
  quantityOfDevice: string;
  premium: string;
  startDate: string;
  endDate: string;
};

export type buildingDataTypes = userType & {
  locationOfProperty: string;
  valueOfProperty: string;
  startDate: string;
  endDate: string;
};

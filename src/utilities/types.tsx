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
  buttonText?: string;
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
  visible?: (insurance: any) => boolean;
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

export type thirdPartyInsuranceFormType = userType & {
  product: string;
  registrationNumber: string;
  chasisNumber: string;
  roadWorthiness: string;
  startDate: string;
  endDate: string;
  makeOfVehicle: string;
  yearOfMake: string;
  modelOfVehicle: string;
  vehicleLicense?: File | null;
  roadWorthinessFile?: File | null;
};

export type enhancedThirdPartyInsuranceFormTypes = userType & {
  makeOfVehicle: string;
  yearOfMake: string;
  modelOfVehicle: string;
  startDate: string;
  endDate: string;
  registrationNumber: string;
  engineNumber: string;
  chasisNumber: string;
  vehicleType: string;
  proofOfOwnership: null | File;
  plan: string;
  id: null | File;
  inspectionState: string;
  inspectionAddress: string;
  dateForInspection: string;
  contactName: string;
  contactPhone: string;
  vehicleLicense?: File | null;
  roadWorthinessFile?: File | null;
  roadWorthiness: string;
};

export type comprehensiveeFormDataTypes = userType & {
  registrationNumber: string;
  coverPeriod: string;
  vehicleValue: string;
  premium: string;
  startDate: string;
  endDate: string;
  makeOfVehicle: string;
  yearOfMake: string;
  modelOfVehicle: string;
  chassisNumber: string;
  vehicleLicense?: File | null;
  roadWorthinessFile?: File | null;
  roadWorthiness: string;
};

export type fleetFormDataTypes = userType & {
  propertyType: string;
  startDate: string;
  endDate: string;
  inventory: vehiclesType[];
};

export type individualAndFamilyHmoDataTypes = userType & {
  plan: string;
  genotype: string;
  bloodGroup: string;
  weight: string;
  height: string;
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
  occupation: string;
  gender: string;
  status?: string;
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
  user: string & userType;
  _id: string;
  status: string;
  agent: userType;
  isTrackerInstalled?: boolean;
};

export type claimsDataType = {
  dateAndTime?: string;
  registrationNumber?: string;
  location?: string;
  narration?: string;
  type?: string;
  estimate?: string;
  property?: string;
  enroleeId?: string;
  attachments?: File[];
  subPolicyId?: string;
};

export type allRiskDataTypes = userType & {
  premium: string;
  startDate: string;
  endDate: string;
  inventory: inventoryType[];
};

export type vehiclesType = {
  makeOfVehicle: string;
  modelOfVehicle: string;
  yearOfMake: string;
  chassisNumber: string;
  registrationNumber: string;
  engineNumber?: string;
  vehicleType: string;
  vehicleValue: string;
  insuranceType: string;
};

export type inventoryType = {
  specifications: string;
  serialNumber: string;
  value: string;
  deviceType: string;
};

export type buildingDataTypes = userType & {
  locationOfProperty: string;
  valueOfProperty: string;
  startDate: string;
  endDate: string;
};

export type faqType = {
  question: string;
  answer: string;
};

export type allRiskInventoryTypes = {
  specifications: string;
  serialNumber: string;
  value: string;
  deviceType: string;
  imei: string;
  model: string;
  modelNumber: string;
};

export type chatType = {
  message: string;
  sender: string;
  id: string;
  loading: boolean;
};

export type policyResponseType = {
  _id: string;
  user: userType;
  agent: string;
  certificate: string;
  isPaid: boolean;
  insuranceType: string;
  registrationNumber: string;
  chasisNumber: string;
  plan: string;
  startDate: string;
  endDate: string;
  status: string;
  makeOfVehicle: string;
  yearOfMake: string;
  modelOfVehicle: string;
  vehicleLicense: null | string;
  roadWorthiness: null | string;
  vehiclePaperRenewal: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  payout: string;
  missingDocuments: boolean;
  attentionRequired: boolean;
  notesAndRemindersConditions: boolean;
  locationOfProperty?: string;
  valueOfProperty?: string;
  premium: string;
};

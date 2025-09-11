export interface Address {
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export interface UserProfile {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  country: string;
  address: Address;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface UpdateProfile {
    firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  country: string;
  address: Address;
}
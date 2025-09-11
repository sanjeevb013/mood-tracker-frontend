export interface SignupPayload {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  country: string;
  password: string;

  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
}

export interface FormData {
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  country: string;
  password: string;
    countryCode: string,
  confirmPassword: string;
  street: string;
  city: string;
  state: string;
  zip: string;
}

export interface LoginData {
  email: string;
  password: string;
}
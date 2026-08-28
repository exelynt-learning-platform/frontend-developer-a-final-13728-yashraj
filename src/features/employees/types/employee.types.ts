export interface Employee {
  id: string
  name: string
  email: string
  emailId?: string
  mobile: string
  country: string
  countryId?: string
  state: string
  district: string
  avatar?: string
  createdAt?: string
}

export type EmployeeInput = Omit<Employee, 'id' | 'createdAt' | 'avatar' | 'emailId' | 'countryId'>

export interface Country {
  id: string
  country: string
  flag?: string
  createdAt?: string
}

import { employeeSchema } from './employeeSchema'

describe('employeeSchema', () => {
  it('rejects required-field and email violations', () => {
    const result = employeeSchema.safeParse({ name: '', email: 'bad', mobile: '12', country: '', state: '', district: '' })
    expect(result.success).toBe(false)
  })

  it('accepts a valid employee form', () => {
    expect(employeeSchema.safeParse({ name: 'Ada Lovelace', email: 'ada@example.com', mobile: '1234567890', country: 'India', state: 'Delhi', district: 'New Delhi' }).success).toBe(true)
  })
})

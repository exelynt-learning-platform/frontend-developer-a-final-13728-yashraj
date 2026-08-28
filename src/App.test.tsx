import { render, screen } from '@testing-library/react'
import { EmployeeTable } from './App'

describe('App', () => {
  it('renders employee details in the list table', () => {
    render(<EmployeeTable employees={[{ id: '1', name: 'Ada Lovelace', email: 'ada@example.com', mobile: '1234567890', country: 'India', state: 'Delhi', district: 'New Delhi' }]} onEdit={() => undefined} onDelete={() => undefined} />)

    expect(screen.getByText('Ada Lovelace')).toBeInTheDocument()
    expect(screen.getByText('ada@example.com')).toBeInTheDocument()
    expect(screen.getByText('India')).toBeInTheDocument()
  })
})

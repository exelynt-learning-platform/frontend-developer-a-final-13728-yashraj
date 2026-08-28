import { zodResolver } from '@hookform/resolvers/zod'
import { Alert, Button, DialogActions, DialogContent, DialogTitle, FormControl, FormHelperText, InputLabel, MenuItem, Select, Stack, TextField } from '@mui/material'
import { Controller, useForm } from 'react-hook-form'
import { useEffect } from 'react'
import type { Country, Employee } from '../types/employee.types'
import { employeeSchema, type EmployeeFormValues } from '../schemas/employeeSchema'
import { getDistricts, getStates } from '../utils/locationData'

interface Props { employee?: Employee | null; countries: Country[]; isSaving: boolean; error?: string; onSubmit: (values: EmployeeFormValues) => void; onCancel: () => void }

export function EmployeeForm({ employee, countries, isSaving, error, onSubmit, onCancel }: Props) {
  const { control, handleSubmit, watch, setValue } = useForm<EmployeeFormValues>({ resolver: zodResolver(employeeSchema), defaultValues: { name: employee?.name ?? '', email: employee?.email ?? '', mobile: employee?.mobile ?? '', country: employee?.country ?? '', state: employee?.state ?? '', district: employee?.district ?? '' } })
  const country = watch('country'); const state = watch('state')
  const states = getStates(country, employee?.state); const districts = getDistricts(country, state, employee?.district)
  useEffect(() => { if (state && !states.includes(state)) { setValue('state', ''); setValue('district', '') } }, [setValue, state, states])
  useEffect(() => { const district = watch('district'); if (district && !districts.includes(district)) setValue('district', '') }, [districts, setValue, watch])
  const field = (name: keyof EmployeeFormValues, label: string, type = 'text') => <Controller name={name} control={control} render={({ field, fieldState }) => <TextField {...field} type={type} label={label} fullWidth error={!!fieldState.error} helperText={fieldState.error?.message} inputProps={name === 'mobile' ? { inputMode: 'numeric', maxLength: 10 } : undefined} />} />
  const select = (name: 'country' | 'state' | 'district', label: string, options: string[]) => <Controller name={name} control={control} render={({ field, fieldState }) => <FormControl fullWidth error={!!fieldState.error}><InputLabel>{label}</InputLabel><Select {...field} label={label}><MenuItem value=""><em>Select {label.toLowerCase()}</em></MenuItem>{options.map((option) => <MenuItem value={option} key={option}>{option}</MenuItem>)}</Select><FormHelperText>{fieldState.error?.message}</FormHelperText></FormControl>} />
  return <form onSubmit={handleSubmit(onSubmit)} noValidate><DialogTitle>{employee ? 'Edit Employee' : 'Add Employee'}</DialogTitle><DialogContent><Stack gap={2} sx={{ pt: 1 }}><Stack direction={{ xs: 'column', sm: 'row' }} gap={2}>{field('name', 'Name')}{field('email', 'Email', 'email')}</Stack><Stack direction={{ xs: 'column', sm: 'row' }} gap={2}>{field('mobile', 'Mobile')}{select('country', 'Country', countries.map((item) => item.country))}</Stack><Stack direction={{ xs: 'column', sm: 'row' }} gap={2}>{select('state', 'State', states)}{select('district', 'District', districts)}</Stack>{error && <Alert severity="error">{error}</Alert>}</Stack></DialogContent><DialogActions sx={{ px: 3, pb: 2, flexDirection: { xs: 'column-reverse', sm: 'row' }, '& > :not(style)': { width: { xs: '100%', sm: 'auto' } } }}><Button onClick={onCancel} disabled={isSaving}>Cancel</Button><Button type="submit" variant="contained" disabled={isSaving}>{isSaving ? 'Saving...' : employee ? 'Save Changes' : 'Add Employee'}</Button></DialogActions></form>
}

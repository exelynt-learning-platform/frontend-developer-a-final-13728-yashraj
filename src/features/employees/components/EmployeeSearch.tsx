import { Button, Stack, TextField } from '@mui/material'
import { useState } from 'react'

export function EmployeeSearch({ isLoading, onSearch, onClear }: { isLoading: boolean; onSearch: (id: string) => void; onClear: () => void }) {
  const [id, setId] = useState('')
  return <Stack component="form" direction={{ xs: 'column', sm: 'row' }} gap={1.5} onSubmit={(event) => { event.preventDefault(); if (id.trim()) onSearch(id.trim()) }}><TextField label="Employee ID" value={id} onChange={(event) => setId(event.target.value)} size="small" fullWidth inputProps={{ 'aria-label': 'Employee ID' }} /><Button type="submit" variant="outlined" disabled={isLoading || !id.trim()}>{isLoading ? 'Searching...' : 'Search'}</Button><Button type="button" onClick={() => { setId(''); onClear() }} disabled={!id}>Clear</Button></Stack>
}

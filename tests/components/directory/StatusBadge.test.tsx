import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { StatusBadge } from '@/components/directory/StatusBadge'

describe('StatusBadge', () => {
  it('renders ONLINE status with filled green dot', () => {
    render(<StatusBadge status="online" />)
    expect(screen.getByText('ONLINE')).toBeInTheDocument()
    expect(screen.getByLabelText('Status: ONLINE')).toBeInTheDocument()
  })

  it('renders IN DEV status with filled amber dot', () => {
    render(<StatusBadge status="development" />)
    expect(screen.getByText('IN DEV')).toBeInTheDocument()
    expect(screen.getByLabelText('Status: IN DEV')).toBeInTheDocument()
  })

  it('renders COMING SOON status with outlined gray dot', () => {
    render(<StatusBadge status="coming_soon" />)
    expect(screen.getByText('COMING SOON')).toBeInTheDocument()
    expect(screen.getByLabelText('Status: COMING SOON')).toBeInTheDocument()
  })

  it('renders MAINTENANCE status with filled red dot', () => {
    render(<StatusBadge status="maintenance" />)
    expect(screen.getByText('MAINTENANCE')).toBeInTheDocument()
    expect(screen.getByLabelText('Status: MAINTENANCE')).toBeInTheDocument()
  })

  it('renders PRIVATE status with outlined gray dot', () => {
    render(<StatusBadge status="private" />)
    expect(screen.getByText('PRIVATE')).toBeInTheDocument()
    expect(screen.getByLabelText('Status: PRIVATE')).toBeInTheDocument()
  })

  it('applies correct color for online status', () => {
    render(<StatusBadge status="online" />)
    const label = screen.getByText('ONLINE')
    expect(label).toHaveStyle({ color: 'var(--status-online)' })
  })

  it('applies correct color for development status', () => {
    render(<StatusBadge status="development" />)
    const label = screen.getByText('IN DEV')
    expect(label).toHaveStyle({ color: 'var(--status-development)' })
  })

  it('applies correct color for coming_soon status', () => {
    render(<StatusBadge status="coming_soon" />)
    const label = screen.getByText('COMING SOON')
    expect(label).toHaveStyle({ color: 'var(--status-coming-soon)' })
  })
})

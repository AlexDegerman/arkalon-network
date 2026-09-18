import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import FeedbackPage from '@/app/feedback/page'

const mockSubmitFeedbackAction = vi.fn()

vi.mock('@/app/actions/submitFeedback', () => ({
  submitFeedbackAction: (...args: any[]) => mockSubmitFeedbackAction(...args)
}))

describe('FeedbackPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockSubmitFeedbackAction.mockResolvedValue({ status: 'success' })
  })

  it('renders the feedback form heading', () => {
    render(<FeedbackPage />)
    expect(screen.getByText('FEEDBACK')).toBeInTheDocument()
  })

  it('renders all form fields: app, category, email, and message', () => {
    render(<FeedbackPage />)
    expect(screen.getByText('App')).toBeInTheDocument()
    expect(screen.getByText('Category')).toBeInTheDocument()
    expect(screen.getByText(/email/i)).toBeInTheDocument()
    expect(screen.getByText('Message')).toBeInTheDocument()
  })

  it('defaults to "any" app slug', () => {
    render(<FeedbackPage />)
    const selects = screen.getAllByRole('combobox')
    expect(selects[0]).toHaveValue('any')
  })

  it('shows AI Arkalon category when app is "any"', () => {
    render(<FeedbackPage />)
    expect(
      screen.getByRole('button', { name: /ai arkalon/i })
    ).toBeInTheDocument()
  })

  it('hides AI Arkalon category when a specific app is selected', () => {
    render(<FeedbackPage />)
    const appSelect = screen.getAllByRole('combobox')[0]
    fireEvent.change(appSelect, { target: { value: 'rps' } })
    expect(
      screen.queryByRole('button', { name: /ai arkalon/i })
    ).not.toBeInTheDocument()
  })

  it('resets category to first available when app changes', () => {
    render(<FeedbackPage />)
    const appSelect = screen.getAllByRole('combobox')[0]

    // Change app to 'rps'
    fireEvent.change(appSelect, { target: { value: 'rps' } })

    // The first category for 'rps' is 'general'
    // Verify the "General Feedback" button is now active (has accent background)
    const generalButton = screen.getByRole('button', {
      name: /general feedback/i
    })
    expect(generalButton).toHaveStyle({
      backgroundColor: 'var(--accent-network)'
    })
  })

  it('shows base placeholder for "any" app', () => {
    render(<FeedbackPage />)
    const textareas = screen.getAllByRole('textbox')
    expect(textareas[1]).toHaveAttribute(
      'placeholder',
      'Share your thoughts or general feedback...'
    )
  })

  it('appends app name to placeholder for specific apps', () => {
    render(<FeedbackPage />)
    const appSelect = screen.getAllByRole('combobox')[0]
    fireEvent.change(appSelect, { target: { value: 'rps' } })
    const textareas = screen.getAllByRole('textbox')
    expect(textareas[1].getAttribute('placeholder')).toMatch(/for RPS League/i)
  })

  it('updates placeholder when category changes', () => {
    render(<FeedbackPage />)
    // Categories are buttons, so we click the "Bug Report" button
    const bugButton = screen.getByRole('button', { name: /bug report/i })
    fireEvent.click(bugButton)

    const textareas = screen.getAllByRole('textbox')
    expect(textareas[1]).toHaveAttribute(
      'placeholder',
      'Describe the issue, steps to reproduce, and expected behavior...'
    )
  })

  it('calls submitFeedbackAction on form submission', async () => {
    render(<FeedbackPage />)
    const textareas = screen.getAllByRole('textbox')
    fireEvent.change(textareas[1], {
      target: { value: 'Test feedback message' }
    })

    const submitButton = screen.getByRole('button', {
      name: /transmit feedback/i
    })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(mockSubmitFeedbackAction).toHaveBeenCalledTimes(1)
    })
  })

  it('disables submit button while submission is pending', async () => {
    mockSubmitFeedbackAction.mockImplementation(
      () => new Promise(() => {}) // never resolves
    )
    render(<FeedbackPage />)

    const textareas = screen.getAllByRole('textbox')
    fireEvent.change(textareas[1], { target: { value: 'Test message' } })

    const submitButton = screen.getByRole('button', {
      name: /transmit feedback/i
    })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(submitButton).toBeDisabled()
    })
  })

  it('shows success state after successful submission', async () => {
    render(<FeedbackPage />)
    const textareas = screen.getAllByRole('textbox')
    fireEvent.change(textareas[1], { target: { value: 'Test message' } })

    const submitButton = screen.getByRole('button', {
      name: /transmit feedback/i
    })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/transmission received/i)).toBeInTheDocument()
    })
  })

  it('shows error state when submission fails', async () => {
    mockSubmitFeedbackAction.mockResolvedValue({
      status: 'error',
      message: 'Failed to submit'
    })
    render(<FeedbackPage />)

    const textareas = screen.getAllByRole('textbox')
    fireEvent.change(textareas[1], { target: { value: 'Test message' } })

    const submitButton = screen.getByRole('button', {
      name: /transmit feedback/i
    })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/Failed to submit/i)).toBeInTheDocument()
    })
  })
})

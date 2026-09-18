import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ArkalonOracle } from '@/components/ai/ArkalonOracle'
import * as aiActions from '@/lib/ai/queryArkalon'

vi.mock('@/lib/ai/queryArkalon', () => ({
  queryArkalonAction: vi.fn()
}))

describe('ArkalonOracle Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    window.HTMLElement.prototype.scrollIntoView = vi.fn()
  })

  it('renders initial consultation sequence state and suggestion pills', () => {
    render(<ArkalonOracle />)

    expect(screen.getByText(/SEQUENCE: 0 \/ 3/i)).toBeInTheDocument()
    expect(screen.getByText('What is the Arkalon Network?')).toBeInTheDocument()
    expect(
      screen.getByText('Does my account work across all apps?')
    ).toBeInTheDocument()
    expect(
      screen.getByPlaceholderText(/Query Arkalon or tap a suggestion/i)
    ).toBeInTheDocument()
  })

  it('clicking a suggestion pill instantly triggers fresh prompt execution', async () => {
    vi.mocked(aiActions.queryArkalonAction).mockResolvedValue({
      status: 'success',
      response: 'The Arkalon Network is the central hub.',
      source: 'Arkalon Core'
    })

    render(<ArkalonOracle />)

    const pill = screen.getByText('What is the Arkalon Network?')
    fireEvent.click(pill)

    await waitFor(() => {
      expect(aiActions.queryArkalonAction).toHaveBeenCalledWith([
        { role: 'user', content: 'What is the Arkalon Network?' }
      ])
      expect(
        screen.getByText('The Arkalon Network is the central hub.')
      ).toBeInTheDocument()
      expect(screen.getByText(/Ref: Arkalon Core/i)).toBeInTheDocument()
    })

    expect(screen.getByText(/SEQUENCE: 1 \/ 3/i)).toBeInTheDocument()
  })

  it('locks input and displays completion card when sequence hits 3 turns', async () => {
    vi.mocked(aiActions.queryArkalonAction).mockResolvedValue({
      status: 'success',
      response: 'Calculation complete.',
      source: 'Arkalon Core'
    })

    render(<ArkalonOracle />)

    const input = screen.getByPlaceholderText(
      /Query Arkalon or tap a suggestion/i
    )
    const sendButton = screen.getByRole('button', { name: '' })

    // Turn 1
    fireEvent.change(input, { target: { value: 'Question 1' } })
    fireEvent.click(sendButton)
    await waitFor(() =>
      expect(screen.getByText('Question 1')).toBeInTheDocument()
    )

    // Turn 2
    fireEvent.change(input, { target: { value: 'Question 2' } })
    fireEvent.click(sendButton)
    await waitFor(() =>
      expect(screen.getByText('Question 2')).toBeInTheDocument()
    )

    // Turn 3
    fireEvent.change(input, { target: { value: 'Question 3' } })
    fireEvent.click(sendButton)
    await waitFor(() =>
      expect(screen.getByText('Question 3')).toBeInTheDocument()
    )

    // Sequence should be locked
    await waitFor(() => {
      expect(screen.getByText('DIVINATION COMPLETE')).toBeInTheDocument()
      expect(screen.getByText('Sequence Complete')).toBeInTheDocument()
      expect(
        screen.getByRole('button', { name: /NEW QUERY/i })
      ).toBeInTheDocument()
    })
  })

  it('clicking Reset clears the consultation history back to 0/3', async () => {
    vi.mocked(aiActions.queryArkalonAction).mockResolvedValue({
      status: 'success',
      response: 'Answer 1',
      source: 'Arkalon Core'
    })

    render(<ArkalonOracle />)

    const pill = screen.getByText('What is Arkalon?')
    fireEvent.click(pill)
    await waitFor(() =>
      expect(screen.getByText('Answer 1')).toBeInTheDocument()
    )

    const resetButton = screen.getByRole('button', { name: /Reset/i })
    fireEvent.click(resetButton)

    expect(screen.getByText(/SEQUENCE: 0 \/ 3/i)).toBeInTheDocument()
    expect(screen.queryByText('Answer 1')).not.toBeInTheDocument()
  })
})

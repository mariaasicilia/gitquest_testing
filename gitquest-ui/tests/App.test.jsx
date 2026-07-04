import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import App from '../src/App'

beforeEach(() => localStorage.clear())

describe('App shell routing', () => {
  test('new recruit: welcome → mission map with derived 0% progress and recruit badge', () => {
    render(<App />)
    expect(screen.getByText('New recruit')).toBeInTheDocument()

    fireEvent.click(screen.getByText('New recruit'))
    expect(screen.getByText(/OVERALL PROGRESS — 0%/)).toBeInTheDocument()
    expect(screen.getByText('NEW RECRUIT')).toBeInTheDocument()
    expect(screen.getByText(/🎖 0\/5/)).toBeInTheDocument()
    expect(screen.getByText(/💰 0/)).toBeInTheDocument()
  })

  test('field agent: welcome → placement assessment, skip → map with field agent badge', () => {
    render(<App />)
    fireEvent.click(screen.getByText('Field agent'))
    expect(screen.getByText('Placement assessment')).toBeInTheDocument()

    fireEvent.click(screen.getByText(/skip placement/))
    expect(screen.getByText('FIELD AGENT')).toBeInTheDocument()
  })

  test('a returning field agent with a stored placement result goes straight to the map with the recommendation banner', () => {
    localStorage.setItem('gitquest-progress', JSON.stringify({
      mode: 'vet',
      placement: { correct: 7, total: 8, pct: 88, passed: true, recommendedMission: 'M3' },
    }))
    render(<App />)
    fireEvent.click(screen.getByText('Field agent'))
    expect(screen.queryByText('Placement assessment')).not.toBeInTheDocument()
    expect(screen.getByText(/recommended start: M3 — Remote Uplink/)).toBeInTheDocument()
  })

  test('opening a mission from the map shows its lessons with lock states, and Start opens the training page', () => {
    render(<App />)
    fireEvent.click(screen.getByText('New recruit'))

    fireEvent.click(screen.getByText('M1')) // map node label
    expect(screen.getByText('Mission 1 — First Contact')).toBeInTheDocument()
    expect(screen.getByText(/M1L1 — git clone/)).toBeInTheDocument()
    // second lesson is locked for a fresh recruit
    expect(screen.getByText(/M1L2 — git pull/).closest('button')).toBeDisabled()

    fireEvent.click(screen.getByText(/▶ Start/))
    expect(screen.getByRole('heading', { name: 'git clone' })).toBeInTheDocument()
    expect(screen.getByLabelText('command input')).toBeInTheDocument()
  })
})

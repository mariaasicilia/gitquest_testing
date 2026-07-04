import { render, screen, fireEvent, act } from '@testing-library/react'
import '@testing-library/jest-dom'
import { ProgressProvider } from '../src/context/ProgressContext'
import TrainingPage from '../src/components/TrainingPage'
import { STORAGE_KEY } from '../src/context/context'

const renderLesson = (levelId, questId, props = {}) =>
  render(
    <ProgressProvider>
      <TrainingPage
        levelId={levelId}
        questId={questId}
        onBack={() => {}}
        onComplete={props.onComplete ?? (() => {})}
        onNextLevel={props.onNextLevel ?? (() => {})}
      />
    </ProgressProvider>
  )

const typeAndExecute = (value) => {
  fireEvent.change(screen.getByLabelText('command input'), { target: { value } })
  fireEvent.click(screen.getByText('Execute'))
}

beforeEach(() => {
  localStorage.clear()
  jest.useFakeTimers()
})

afterEach(() => {
  jest.useRealTimers()
})

describe('TrainingPage — single-command battle', () => {
  test('renders tutorial content and the battle scenario', () => {
    renderLesson('M2L1', 'M2')
    expect(screen.getByRole('heading', { name: 'git status' })).toBeInTheDocument()
    expect(screen.getByText(/HANDLER BRIEFING/)).toBeInTheDocument()
    expect(screen.getByLabelText('command input')).toBeInTheDocument()
  })

  test('a correct first-try answer completes the lesson with a 100 score and persists it', () => {
    renderLesson('M2L1', 'M2')
    typeAndExecute('git status')
    expect(screen.getByText(/COMMAND ACCEPTED/)).toBeInTheDocument()

    act(() => jest.runAllTimers())
    expect(screen.getByText(/OBJECTIVE SECURED/)).toBeInTheDocument()
    expect(screen.getByText(/ASSESSMENT SCORE: 100 \/ 100/)).toBeInTheDocument()

    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY))
    expect(stored.completedLevels).toContain('M2L1')
    expect(stored.scores['M2L1']).toBe(100)
  })

  test('empty input gets a specific message, not a generic rejection', () => {
    renderLesson('M2L1', 'M2')
    fireEvent.click(screen.getByText('Execute'))
    expect(screen.getByText(/didn\u2019t enter a command/)).toBeInTheDocument()
  })

  test('a wrong command gets a targeted diagnostic and allows retry', () => {
    renderLesson('M2L1', 'M2')
    typeAndExecute('git log')
    expect(screen.getByText(/won\u2019t accomplish this objective/)).toBeInTheDocument()

    // retry directly in the same field
    typeAndExecute('git status')
    expect(screen.getByText(/COMMAND ACCEPTED/)).toBeInTheDocument()
  })

  test('hint timing: reveal button after 1 wrong attempt, automatic after 2, and the score reflects it', () => {
    renderLesson('M2L1', 'M2')
    expect(screen.queryByText(/^HINT:/)).not.toBeInTheDocument()

    typeAndExecute('git wrong')
    expect(screen.getByText(/reveal hint/)).toBeInTheDocument()
    expect(screen.queryByText(/^HINT:/)).not.toBeInTheDocument()

    typeAndExecute('git wronger')
    expect(screen.getByText(/HINT:/)).toBeInTheDocument()

    typeAndExecute('git status')
    act(() => jest.runAllTimers())
    // 2 wrong attempts (−50) + hint (−10) → 40
    expect(screen.getByText(/ASSESSMENT SCORE: 40 \/ 100/)).toBeInTheDocument()
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY)).hintsUsed).toBe(1)
  })

  test('a lesson-specific reject rule shows its teaching message (git add .)', () => {
    renderLesson('M1L3', 'M1')
    typeAndExecute('git add .')
    expect(screen.getByText(/stages EVERYTHING/)).toBeInTheDocument()
  })

  test('accepted variants pass (git switch for checkout)', () => {
    renderLesson('M2L4', 'M2')
    typeAndExecute('git switch decoy-operation')
    expect(screen.getByText(/COMMAND ACCEPTED/)).toBeInTheDocument()
  })

  test('completion offers Next lesson once completing this one unlocks it', () => {
    const onNextLevel = jest.fn()
    renderLesson('M1L1', 'M1', { onNextLevel })
    typeAndExecute('git clone https://github.com/us-cyber/shadow-breach.git')
    act(() => jest.runAllTimers())
    fireEvent.click(screen.getByText(/Next lesson/))
    expect(onNextLevel).toHaveBeenCalledWith('M1L2', 'M1')
  })

  test('completion hides Next lesson when the next lesson is still locked (out-of-order replay in recruit mode)', () => {
    // A recruit replaying M2L1 (e.g. via imported progress) must not be able
    // to jump to a locked M2L2 from the completion panel.
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ completedLevels: ['M2L1'], mode: 'new' }))
    renderLesson('M2L1', 'M2')
    typeAndExecute('git status')
    act(() => jest.runAllTimers())
    expect(screen.queryByText(/Next lesson/)).not.toBeInTheDocument()
  })

  test('unknown lesson id shows the missing-data screen instead of crashing', () => {
    renderLesson('M9L9', 'M9')
    expect(screen.getByText(/No training data found/)).toBeInTheDocument()
  })
})

describe('TrainingPage — capstone sequence battle', () => {
  test('steps advance in order, wrong commands fail only the current step, and completion averages the scores', () => {
    renderLesson('M5L1', 'M5')
    expect(screen.getByText('STEP 1 / 7')).toBeInTheDocument()

    // Step 1: correct
    typeAndExecute('git status')
    act(() => jest.advanceTimersByTime(2000))
    expect(screen.getByText('STEP 2 / 7')).toBeInTheDocument()

    // Step 2: the step-specific reject rule fires and the step does NOT advance
    typeAndExecute('git pull')
    expect(screen.getByText(/STEP FAILED/)).toBeInTheDocument()
    expect(screen.getByText('STEP 2 / 7')).toBeInTheDocument()

    // Recover and finish the operation
    const remaining = [
      'git fetch',
      'git checkout firewall-hotfix',
      'git add firewall-patch.txt',
      'git commit -m "my own commit message"',
      'git push',
      'git pull',
    ]
    for (const cmd of remaining) {
      typeAndExecute(cmd)
      act(() => jest.advanceTimersByTime(2000))
    }

    expect(screen.getByText(/OBJECTIVE SECURED/)).toBeInTheDocument()
    // Six perfect steps + one 75 (the failed git pull step) → avg 96
    expect(screen.getByText(/ASSESSMENT SCORE: 96 \/ 100/)).toBeInTheDocument()
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY)).completedLevels).toContain('M5L1')
  })
})

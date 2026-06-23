import { useState } from 'react'

const TRAINING_DATA = {
  'git add': {
    title: 'git add',
    subtitle: 'Stage your changes for the next commit',
    briefing: `Intelligence has picked up modified files in your local repo. Before you can commit evidence to the secure log, you need to stage the files — telling Git exactly what to include. This is your "load the weapon before firing" step.`,
    sections: [
      {
        heading: 'What it does',
        body: `git add moves changes from your working directory into the staging area. Think of the staging area as a holding zone — nothing gets committed until you explicitly add it first.`,
      },
      {
        heading: 'Basic syntax',
        blocks: [
          { code: 'git add <filename>', desc: 'Stage a single file' },
          { code: 'git add .', desc: 'Stage everything in the current directory' },
          { code: 'git add -p', desc: 'Interactively choose which changes to stage (chunk by chunk)' },
        ],
      },
      {
        heading: 'Example',
        terminal: [
          { prompt: '$', cmd: 'git status', comment: '# see what changed' },
          { output: 'modified:   mission_log.txt\nuntracked:  payload.sh' },
          { prompt: '$', cmd: 'git add mission_log.txt' },
          { prompt: '$', cmd: 'git status', comment: '# check again' },
          { output: 'Changes to be committed:\n  modified: mission_log.txt' },
        ],
      },
      {
        heading: 'Watch out for',
        warnings: [
          'git add . stages everything including files you might not want committed — always check git status first.',
          'Adding a file doesn\'t save it permanently — you still need git commit after.',
        ],
      },
    ],
    battle: {
      scenario: `ALERT: Shadow Breach operatives have modified two critical files — "firewall_config.txt" and "access_log.txt" — with false data. You've corrected both files locally. Your handler says: "Stage only the firewall config for now. Don't touch the access log yet."`,
      expected: 'git add firewall_config.txt',
      hint: 'Stage a single specific file, not everything.',
    },
  },
  'git commit -m': {
    title: 'git commit -m',
    subtitle: 'Lock in your staged changes with a message',
    briefing: `Staging was just the prep work. Now you need to permanently record your changes into the mission log. A commit is a snapshot — every commit is traceable, timestamped, and signed.`,
    sections: [
      {
        heading: 'What it does',
        body: `git commit saves everything in the staging area as a permanent snapshot in your repo's history. The -m flag lets you write the commit message inline instead of opening an editor.`,
      },
      {
        heading: 'Basic syntax',
        blocks: [
          { code: 'git commit -m "your message"', desc: 'Commit with an inline message' },
          { code: 'git commit -am "message"', desc: 'Stage all tracked files and commit in one step' },
        ],
      },
      {
        heading: 'Example',
        terminal: [
          { prompt: '$', cmd: 'git commit -m "fix: patch firewall rule 42"' },
          { output: '[main 4f3a1c2] fix: patch firewall rule 42\n 1 file changed, 3 insertions(+), 1 deletion(-)' },
        ],
      },
      {
        heading: 'Watch out for',
        warnings: [
          'If the staging area is empty, git commit does nothing — make sure you\'ve run git add first.',
          'Write meaningful messages. "fix stuff" is useless in a 6-month-old repo.',
        ],
      },
    ],
    battle: {
      scenario: `ALERT: You've staged the corrected firewall config. Your handler radios in: "Commit it now. Message should say exactly: 'fix: restored firewall_config to secure state'"`,
      expected: 'git commit -m "fix: restored firewall_config to secure state"',
      hint: 'Use the -m flag and match the message exactly.',
    },
  },
  'git commit --amend': {
    title: 'git commit --amend',
    subtitle: 'Fix your last commit before it\'s too late',
    briefing: `You submitted a mission report with a typo in the title. Before it gets pushed to headquarters, you can silently correct it. Amend rewrites the last commit — same changes, new message, new identity.`,
    sections: [
      {
        heading: 'What it does',
        body: `git commit --amend replaces the most recent commit with a new one. You can change the message, add forgotten files, or both. It rewrites history — only safe before you've pushed.`,
      },
      {
        heading: 'Basic syntax',
        blocks: [
          { code: 'git commit --amend -m "new message"', desc: 'Change the last commit message' },
          { code: 'git add forgotten.txt\ngit commit --amend --no-edit', desc: 'Add a forgotten file without changing the message' },
        ],
      },
      {
        heading: 'Example',
        terminal: [
          { prompt: '$', cmd: 'git commit -m "fxi: firewall patch"', comment: '# typo!' },
          { output: '[main 9a2b3c1] fxi: firewall patch' },
          { prompt: '$', cmd: 'git commit --amend -m "fix: firewall patch"' },
          { output: '[main 7d4e8f2] fix: firewall patch' },
        ],
      },
      {
        heading: 'Watch out for',
        warnings: [
          'Never amend a commit that\'s already been pushed — it rewrites history and will conflict with teammates.',
          '--amend creates a brand new commit hash. The old one is gone.',
        ],
      },
    ],
    battle: {
      scenario: `ALERT: Your last commit message reads "updte access controls" — a typo that will flag an audit. Fix it before it reaches HQ. The correct message should be: "update access controls"`,
      expected: 'git commit --amend -m "update access controls"',
      hint: 'Rewrite the last commit message using --amend.',
    },
  },
  'staging vs. commit': {
    title: 'Staging vs. commit',
    subtitle: 'Two steps, two purposes',
    briefing: `New recruits often confuse staging and committing. They're not the same step. Understanding the difference is the difference between a sloppy agent and a clean one.`,
    sections: [
      {
        heading: 'The two zones',
        body: `Your working directory is where you edit files freely. The staging area is where you deliberately select what goes into the next snapshot. The commit is the snapshot itself — permanent and traceable.`,
      },
      {
        heading: 'The flow',
        blocks: [
          { code: 'edit file → git add → git commit', desc: 'The three-step cycle every change goes through' },
        ],
      },
      {
        heading: 'Side by side',
        comparison: [
          { label: 'git add', point: 'Moves changes to staging. Nothing is saved permanently yet.' },
          { label: 'git commit', point: 'Saves the staged snapshot forever in repo history.' },
        ],
      },
      {
        heading: 'Watch out for',
        warnings: [
          'git commit alone won\'t pick up new/untracked files — you must git add them first.',
          'You can stage multiple times before committing — useful for grouping related changes.',
        ],
      },
    ],
    battle: {
      scenario: `ALERT: A trainee just ran git commit without staging anything first and got an error. Your handler asks: "What's the correct two-command sequence to stage all changes in the current directory and then commit with the message 'chore: sync mission files'?" Enter both commands separated by && `,
      expected: 'git add . && git commit -m "chore: sync mission files"',
      hint: 'Stage everything first, then commit with the right message.',
    },
  },
}

function TerminalBlock({ lines }) {
  return (
    <div style={{ background: '#040810', border: '1px solid #1a2a45', borderRadius: 8, padding: '1rem', fontFamily: 'monospace', fontSize: 13, lineHeight: 1.7 }}>
      {lines.map((line, i) => {
        if (line.output) {
          return (
            <div key={i} style={{ color: '#4a6fa5', whiteSpace: 'pre', paddingLeft: 16 }}>{line.output}</div>
          )
        }
        return (
          <div key={i} style={{ display: 'flex', gap: 8 }}>
            <span style={{ color: '#00ff8877' }}>{line.prompt}</span>
            <span style={{ color: '#c8daf0' }}>{line.cmd}</span>
            {line.comment && <span style={{ color: '#2a3a55' }}>{line.comment}</span>}
          </div>
        )
      })}
    </div>
  )
}

function BattleSection({ battle, onComplete }) {
  const [input, setInput] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [correct, setCorrect] = useState(false)
  const [attempts, setAttempts] = useState(0)
  const [showHint, setShowHint] = useState(false)

  const handleSubmit = () => {
    const trimmed = input.trim()
    const isCorrect = trimmed === battle.expected
    setCorrect(isCorrect)
    setSubmitted(true)
    setAttempts(a => a + 1)
    if (isCorrect) setTimeout(() => onComplete(), 1200)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSubmit()
  }

  const handleRetry = () => {
    setInput('')
    setSubmitted(false)
    if (attempts >= 1) setShowHint(true)
  }

  return (
    <div style={{ marginTop: '2rem', borderTop: '1px solid #1a2a45', paddingTop: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '1rem' }}>
        <span style={{ fontSize: 10, color: '#e24b4a', letterSpacing: '0.15em', fontFamily: 'monospace', border: '1px solid #e24b4a44', borderRadius: 4, padding: '3px 8px' }}>BATTLE</span>
        <span style={{ fontSize: 11, color: '#4a6fa5', fontFamily: 'monospace' }}>FIELD SCENARIO</span>
      </div>

      <div style={{ background: '#080c17', border: '1px solid #e24b4a33', borderRadius: 8, padding: '1rem 1.25rem', marginBottom: '1.25rem', fontSize: 13, color: '#c8daf0', lineHeight: 1.7, fontFamily: 'monospace' }}>
        <span style={{ color: '#e24b4a' }}>ALERT: </span>{battle.scenario.replace('ALERT: ', '')}
      </div>

      {showHint && (
        <div style={{ background: '#0d1f15', border: '1px solid #00ff8833', borderRadius: 8, padding: '10px 14px', marginBottom: '1rem', fontSize: 12, color: '#00cc66', fontFamily: 'monospace' }}>
          HINT: {battle.hint}
        </div>
      )}

      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <span style={{ color: '#00ff8877', fontFamily: 'monospace', fontSize: 14 }}>$</span>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={submitted && correct}
          placeholder="enter command..."
          style={{
            flex: 1, background: '#040810',
            border: `1px solid ${submitted ? (correct ? '#00ff88' : '#e24b4a') : '#1a2a45'}`,
            borderRadius: 8, padding: '10px 14px',
            color: '#c8daf0', fontFamily: 'monospace', fontSize: 13,
            outline: 'none',
          }}
        />
        <button
          onClick={submitted && !correct ? handleRetry : handleSubmit}
          disabled={!input.trim()}
          style={{
            background: '#003322', border: '1px solid #00ff88',
            color: '#00ff88', borderRadius: 8, padding: '10px 20px',
            cursor: input.trim() ? 'pointer' : 'not-allowed',
            fontFamily: 'monospace', fontSize: 13,
            opacity: input.trim() ? 1 : 0.4,
          }}
        >
          {submitted && !correct ? 'Retry' : 'Execute'}
        </button>
      </div>

      {submitted && (
        <div style={{ marginTop: 10, fontSize: 12, fontFamily: 'monospace', color: correct ? '#00ff88' : '#e24b4a' }}>
          {correct
            ? '✓ COMMAND ACCEPTED — mission objective secured'
            : `✗ REJECTED — ${attempts > 1 ? 'check your syntax carefully' : 'try again'}`}
        </div>
      )}
    </div>
  )
}

export default function TrainingPage({ levelId, questId, onBack, onComplete }) {
  const data = TRAINING_DATA[levelId]
  const [battleDone, setBattleDone] = useState(false)
  const [skippedToBottom, setSkippedToBottom] = useState(false)

  if (!data) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', color: '#4a6fa5', fontFamily: 'monospace' }}>
        <div>No training data found for: {levelId}</div>
        <button onClick={onBack} style={{ marginTop: 16, color: '#00ff88', background: 'none', border: '1px solid #00ff8844', borderRadius: 8, padding: '8px 16px', cursor: 'pointer', fontFamily: 'monospace' }}>← back</button>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', position: 'relative', zIndex: 1 }}>

      {/* Topbar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderBottom: '1px solid #1a2a45', background: '#080c17', position: 'sticky', top: 0, zIndex: 10 }}>
        <button onClick={onBack} style={{ fontSize: 11, color: '#4a6fa5', background: 'none', border: '1px solid #1a2a45', borderRadius: 6, padding: '5px 12px', cursor: 'pointer', fontFamily: 'monospace' }}>
          ← back
        </button>
        <span style={{ fontSize: 11, color: '#4a6fa5', fontFamily: 'monospace' }}>{questId}</span>
        <span style={{ color: '#2a3a55', fontFamily: 'monospace' }}>/</span>
        <span style={{ fontSize: 11, color: '#00ff88', fontFamily: 'monospace' }}>{data.title}</span>
        <div style={{ flex: 1 }} />
        <button
          onClick={() => {
            setSkippedToBottom(true)
            setTimeout(() => document.getElementById('battle-section')?.scrollIntoView({ behavior: 'smooth' }), 50)
          }}
          style={{ fontSize: 11, color: '#4a6fa5', background: 'none', border: '1px solid #1a2a45', borderRadius: 6, padding: '5px 12px', cursor: 'pointer', fontFamily: 'monospace' }}
        >
          skip to battle ↓
        </button>
      </div>

      {/* Content */}
      <div style={{ flex: 1, maxWidth: 680, width: '100%', margin: '0 auto', padding: '2rem 1.5rem' }}>

        {/* Mission briefing header */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ fontSize: 10, color: '#4a6fa5', letterSpacing: '0.15em', fontFamily: 'monospace', marginBottom: 8 }}>TRAINING MODULE</div>
          <h1 style={{ fontSize: 24, fontWeight: 500, color: '#00ff88', fontFamily: 'monospace', marginBottom: 4 }}>{data.title}</h1>
          <div style={{ fontSize: 13, color: '#4a6fa5', fontFamily: 'monospace', marginBottom: '1.25rem' }}>{data.subtitle}</div>
          <div style={{ background: '#080c17', border: '1px solid #1a2a45', borderLeft: '3px solid #00ff8844', borderRadius: 8, padding: '1rem 1.25rem', fontSize: 13, color: '#8aaccf', lineHeight: 1.8, fontFamily: 'monospace' }}>
            <span style={{ color: '#4a6fa5', fontSize: 10, letterSpacing: '0.1em', display: 'block', marginBottom: 6 }}>HANDLER BRIEFING</span>
            {data.briefing}
          </div>
        </div>

        {/* Sections */}
        {data.sections.map((section, i) => (
          <div key={i} style={{ marginBottom: '2rem' }}>
            <div style={{ fontSize: 11, color: '#00ff8888', letterSpacing: '0.12em', fontFamily: 'monospace', marginBottom: '0.75rem', textTransform: 'uppercase' }}>
              {section.heading}
            </div>

            {section.body && (
              <p style={{ fontSize: 14, color: '#8aaccf', lineHeight: 1.8, fontFamily: 'monospace' }}>{section.body}</p>
            )}

            {section.blocks && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {section.blocks.map((block, j) => (
                  <div key={j} style={{ background: '#040810', border: '1px solid #1a2a45', borderRadius: 8, padding: '12px 16px' }}>
                    <div style={{ fontFamily: 'monospace', fontSize: 13, color: '#00ff88', marginBottom: 4, whiteSpace: 'pre' }}>{block.code}</div>
                    <div style={{ fontFamily: 'monospace', fontSize: 12, color: '#4a6fa5' }}>{block.desc}</div>
                  </div>
                ))}
              </div>
            )}

            {section.terminal && <TerminalBlock lines={section.terminal} />}

            {section.comparison && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                {section.comparison.map((item, j) => (
                  <div key={j} style={{ background: '#080c17', border: '1px solid #1a2a45', borderRadius: 8, padding: '1rem' }}>
                    <div style={{ fontFamily: 'monospace', fontSize: 13, color: '#00ff88', marginBottom: 6 }}>{item.label}</div>
                    <div style={{ fontFamily: 'monospace', fontSize: 12, color: '#4a6fa5', lineHeight: 1.7 }}>{item.point}</div>
                  </div>
                ))}
              </div>
            )}

            {section.warnings && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {section.warnings.map((w, j) => (
                  <div key={j} style={{ display: 'flex', gap: 10, background: '#0f0a0a', border: '1px solid #e24b4a22', borderRadius: 8, padding: '10px 14px' }}>
                    <span style={{ color: '#e24b4a', fontFamily: 'monospace', fontSize: 13, flexShrink: 0 }}>!</span>
                    <span style={{ fontFamily: 'monospace', fontSize: 12, color: '#8a6a6a', lineHeight: 1.7 }}>{w}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}

        {/* Divider */}
        <div id="battle-section" style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '2rem 0' }}>
          <div style={{ flex: 1, height: 1, background: '#1a2a45' }} />
          <span style={{ fontSize: 10, color: '#2a3a55', fontFamily: 'monospace', letterSpacing: '0.15em' }}>FIELD ASSESSMENT</span>
          <div style={{ flex: 1, height: 1, background: '#1a2a45' }} />
        </div>

        {/* Battle */}
        {battleDone ? (
          <div style={{ textAlign: 'center', padding: '2rem', border: '1px solid #00ff8844', borderRadius: 12, background: '#0d1f15' }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>✓</div>
            <div style={{ fontFamily: 'monospace', fontSize: 14, color: '#00ff88', marginBottom: 4 }}>OBJECTIVE SECURED</div>
            <div style={{ fontFamily: 'monospace', fontSize: 12, color: '#4a6fa5', marginBottom: '1.5rem' }}>Training module complete. Returning to mission...</div>
            <button onClick={onComplete} style={{ background: '#003322', border: '1px solid #00ff88', color: '#00ff88', borderRadius: 8, padding: '10px 24px', cursor: 'pointer', fontFamily: 'monospace', fontSize: 13 }}>
              Continue ▶
            </button>
          </div>
        ) : (
          <BattleSection battle={data.battle} onComplete={() => setBattleDone(true)} />
        )}

        <div style={{ height: '3rem' }} />
      </div>
    </div>
  )
}
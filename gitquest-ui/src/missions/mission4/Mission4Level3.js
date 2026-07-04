export const mission4level3 = {
  id: 'M4L3',
  cmd: 'git rebase --continue',
  diff: 'hard',
  title: 'Rebase conflict recovery',
  subtitle: 'Resolve a conflict mid-rebase and resume the operation',
  briefing: `Mid-rebase, alarms: one of your replayed commits edits the same lines of intel-log.txt that a new commit on main also changed. Git can't decide which version is right, so the rebase has PAUSED and is waiting for you. Don't panic — this is a routine field procedure.`,
  sections: [
    {
      heading: 'What a conflict is',
      body: `A conflict means two commits changed the same part of the same file and Git needs a human decision. During a paused rebase, Git marks the disputed region in the file with conflict markers (<<<<<<<, =======, >>>>>>>). Your job: edit the file to the version you want, stage it, then tell the rebase to continue.`,
    },
    {
      heading: 'The recovery procedure',
      blocks: [
        { code: '1. Open the conflicted file and fix it', desc: 'Remove the conflict markers, keep the correct content' },
        { code: '2. git add <file>', desc: 'Stage the resolved file to mark the conflict as handled' },
        { code: '3. git rebase --continue', desc: 'Resume the rebase with your resolution' },
      ],
    },
    {
      heading: 'Example',
      terminal: [
        { prompt: '$', cmd: 'git rebase main' },
        { output: 'CONFLICT (content): Merge conflict in intel-log.txt\nerror: could not apply 4f1d2ab... update intel log' },
        { prompt: '$', cmd: 'nano intel-log.txt', comment: '# resolve the markers' },
        { prompt: '$', cmd: 'git add intel-log.txt' },
        { prompt: '$', cmd: 'git rebase --continue' },
        { output: 'Successfully rebased and updated refs/heads/intel-analysis.' },
      ],
    },
    {
      heading: 'Watch out for',
      warnings: [
        'git rebase --abort cancels everything and returns to the pre-rebase state — a valid escape hatch, but it throws away the rebase, not a way to finish it.',
        'git rebase --skip drops the conflicting commit entirely — its changes are lost from the rebase.',
        'Always stage the resolved file BEFORE continuing, or Git will stop you again.',
      ],
    },
  ],
  battle: {
    scenario: `You've edited intel-log.txt, removed the conflict markers, and already staged the resolved file with git add. One step remains: tell Git to resume the paused rebase.`,
    expected: 'git rebase --continue',
    reject: [
      { cmd: 'git rebase --abort', message: 'That cancels the ENTIRE rebase and throws away your progress — including the conflict you just resolved. You want to resume, not retreat.' },
      { cmd: 'git rebase --skip', message: 'That drops the conflicting commit entirely, losing its changes. You already resolved the conflict — resume the rebase instead.' },
    ],
    hint: 'The file is fixed and staged — resume the rebase with the flag that means "keep going".',
  },
}

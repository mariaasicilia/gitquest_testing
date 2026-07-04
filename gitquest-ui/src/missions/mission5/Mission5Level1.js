export const mission5level1 = {
  id: 'M5L1',
  cmd: 'capstone',
  diff: 'hard',
  title: 'Final Breach — Capstone',
  subtitle: 'One live incident. Seven commands. No second chances for the firewall.',
  briefing: `THIS IS NOT A DRILL. Shadow Breach is attacking the agency firewall right now. A patch (firewall-patch.txt) has been written on the firewall-hotfix branch, but the fix isn't finished, committed, or published. You will run the entire operation — inspect, sync, branch, stage, commit, publish, and recover from a mid-operation surprise. The battle below tells you exactly which step of the operation you're on; each step needs one command.`,
  sections: [
    {
      heading: 'How the capstone works',
      body: `Unlike earlier missions, this battle is a SEQUENCE. Each step presents a live situation and expects the single command that handles it. A wrong command fails that step only — you'll be told which step failed and why, then you retry the same step. Complete all seven steps to neutralize Shadow Breach.`,
    },
    {
      heading: 'Operation checklist',
      blocks: [
        { code: '1. Inspect', desc: 'Know the state of your working directory before touching anything' },
        { code: '2. Sync intel', desc: 'Download remote updates without merging' },
        { code: '3. Move to the hotfix branch', desc: 'The patch work lives on firewall-hotfix' },
        { code: '4. Stage the patch', desc: 'Stage exactly the patched file' },
        { code: '5. Commit', desc: 'Snapshot the fix with a message in your own words' },
        { code: '6. Publish', desc: 'Get the fix onto the shared remote' },
        { code: '7. Recover', desc: 'Handle whatever the field throws at you' },
      ],
    },
  ],
  battle: {
    type: 'sequence',
    scenario: `ALERT: live intrusion in progress. Work the operation one command at a time. HQ is watching.`,
    hint: 'Each step\u2019s hint appears after a failed attempt \u2014 read the situation text carefully first.',
    steps: [
      {
        objective: `You've just sat down at the terminal. Before doing anything else, inspect the state of your working directory — what's modified, staged, or untracked?`,
        expected: 'git status',
        hint: 'The read-only situation report — one word after git.',
        success: 'Working tree report received: firewall-patch.txt is modified but unstaged on firewall-hotfix.',
      },
      {
        objective: `HQ says other agents have been pushing intel to the remote. Download their updates — but do NOT merge anything into your work yet.`,
        expected: 'git fetch',
        accept: ['git fetch origin'],
        reject: [
          { cmd: 'git pull', message: 'STEP FAILED — git pull would merge immediately and could disturb the half-finished patch. Download only.' },
        ],
        hint: 'Download without merging — the safe sync from Mission 3.',
        success: 'Remote intel downloaded. Your working files are untouched.',
      },
      {
        objective: `The patch lives on the firewall-hotfix branch, but you're currently on main. Switch to the hotfix branch.`,
        expected: 'git checkout firewall-hotfix',
        accept: ['git switch firewall-hotfix'],
        hint: 'Switch branches — checkout (or switch) followed by the branch name.',
        success: 'Switched to branch firewall-hotfix. The patch file is in front of you.',
      },
      {
        objective: `The patch in firewall-patch.txt is complete. Stage exactly that file — nothing else in the directory is cleared for commit.`,
        expected: 'git add firewall-patch.txt',
        reject: [
          { cmd: 'git add .', message: 'STEP FAILED — that stages EVERYTHING, including files not cleared for commit. Stage only the patch file.' },
          { cmd: 'git add -A', message: 'STEP FAILED — that stages everything in the repository. Stage only the patch file.' },
        ],
        hint: 'Stage one specific file by name.',
        success: 'firewall-patch.txt staged and ready for commit.',
      },
      {
        objective: `Snapshot the staged fix into history. Write the commit message in your own words — just make it a real, quoted message.`,
        expected: 'git commit -m "Patch firewall breach"',
        accept: ['git commit -m <message>'],
        hint: 'Commit with -m and a quoted message of your choosing.',
        success: 'Commit created. The fix now exists in history on firewall-hotfix.',
      },
      {
        objective: `The fix means nothing while it only exists on your machine. Publish your branch's commits to the shared remote.`,
        expected: 'git push',
        accept: ['git push origin firewall-hotfix'],
        reject: [
          { cmd: 'git push --force', message: 'STEP FAILED — never force-push as a default. A normal push is all this situation needs.' },
          { cmd: 'git push -f', message: 'STEP FAILED — never force-push as a default. A normal push is all this situation needs.' },
        ],
        hint: 'A plain publish — your branch tracks the remote.',
        success: '…push REJECTED by the remote. Stand by for new orders.',
      },
      {
        objective: `FIELD SURPRISE: the push was rejected — agent Kestrel pushed a commit to firewall-hotfix while you worked, so the remote has history you don't. Bring Kestrel's commit into your branch (download AND merge) so you can push again.`,
        expected: 'git pull',
        accept: ['git pull origin firewall-hotfix'],
        reject: [
          { cmd: 'git push --force-with-lease', message: 'STEP FAILED — that would overwrite Kestrel\u2019s legitimate commit. Their work must be KEPT, not replaced. Integrate it instead.' },
          { cmd: 'git push --force', message: 'STEP FAILED — that would destroy Kestrel\u2019s pushed work unconditionally. Integrate their commit instead.' },
          { cmd: 'git fetch', message: 'STEP FAILED — fetch alone only downloads. This time you need their commit merged into your branch so your next push is accepted.' },
        ],
        hint: 'This time you WANT the download-and-merge command.',
        success: 'Kestrel\u2019s commit merged. Your follow-up push is accepted — the patch is live. SHADOW BREACH NEUTRALIZED.',
      },
    ],
  },
}

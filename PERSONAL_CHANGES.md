# Personal changes

This clone tracks two remotes:

| Remote   | Repo                      | Used for                                     |
|----------|---------------------------|----------------------------------------------|
| `origin` | `esmane/endless-bento`    | Upstream. Pull from it, open PRs against it. |
| `mine`   | `Ferrisx4/endless-bento`  | My fork. Holds personal branches and PR branches. |

## Branch layout

```
origin/main ── A ── B ── C                        upstream, never committed to directly
                         \
                          ── style ── other ...   personal-style (only on `mine`)
                         \
                          ── fix ...              PR branches (pushed to `mine`, PR'd to `origin`)
```

- **`personal-style`** is a small stack of commits on top of `origin/main`. Each
  commit is one personal change (the style patch, this file, ...). It is never
  merged into anything or PR'd upstream; it gets rebased onto `origin/main` instead.
- **PR branches** always start from `origin/main`, never from `personal-style`.

Upstream files use CRLF line endings. Keep them that way (check your editor),
or every line shows up as changed and rebases start conflicting.

## Pulling in upstream changes

```sh
git fetch origin
git switch personal-style
git rebase origin/main
git push --force-with-lease mine personal-style
ssh <server> ./deploy-bento.sh          # see section 4
```

If a rebase conflicts, the files involved are usually `index.html` (capitalization)
or `styles.css` / `js/interface/menu.js` (colors). Keep upstream's change and
re-apply the personal one on top, then `git add <file> && git rebase --continue`.
If upstream added new lowercase UI text, capitalize it as a style update (below).

## 1. Updating my personal style

Colors live in two places and have to change together:

- `styles.css`: `body` background, `#header` background, `#left-side .tile-50`
  (clue tile) background.
- `js/interface/menu.js`, `setBackground()`: the "set light" branch repeats the
  body and header colors, and the "set dark" branch holds the dark-mode colors.
  If you skip these, toggling dark mode resets the colors to whatever is here.

Capitalization lives in `index.html` (headings, buttons, labels, links, the
bold setting names in the help text, and the popup button).

Fold the change into the existing style commit so it stays a single commit:

```sh
git switch personal-style
# edit files
git add -p
git commit --fixup=":/Personal style"
GIT_SEQUENCE_EDITOR=: git rebase -i --autosquash origin/main
git push --force-with-lease mine personal-style
```

## 2. Adding other personal-only changes

Anything that should never go upstream gets its own commit on `personal-style`:

```sh
git switch personal-style
# make the change
git add <files>
git commit -m "Personal: <what it is>"
git push --force-with-lease mine personal-style
```

Start the message with `Personal:` so the stack is easy to read
(`git log --oneline origin/main..personal-style`). Later edits to the same
change work like the style update: `git commit --fixup=":/Personal: <what it is>"`
followed by the autosquash rebase.

Keep each personal commit small and on its own topic. Small commits rebase
cleanly. Large ones conflict with every upstream change.

## 3. New features and fixes to PR upstream

```sh
git fetch origin
git switch -c <topic> origin/main      # not from personal-style
# work, commit
git push -u mine <topic>
gh pr create --repo esmane/endless-bento --base main --head Ferrisx4:<topic>
```

Before pushing, confirm none of the personal stack slipped in:

```sh
git log --oneline origin/main..<topic>   # only the PR's own commits
git diff --stat origin/main..<topic>     # no PERSONAL_CHANGES.md, no style changes
```

To try the feature together with the personal style, use a throwaway branch
and leave the PR branch untouched:

```sh
git switch -c try-<topic> personal-style
git merge <topic>
# test, then
git switch personal-style && git branch -D try-<topic>
```

To answer review feedback, commit on `<topic>` and `git push`. If upstream
moved on, `git rebase origin/main` and `git push --force-with-lease`.

After the PR is merged:

```sh
git fetch origin
git switch personal-style
git rebase origin/main
git push --force-with-lease mine personal-style
git branch -d <topic>                  # -D if upstream squash-merged it
git push mine --delete <topic>
```

## 4. Hosting my version on the web server

The server only ever runs what's on `mine/personal-style`. Nothing is edited
there: changes are made locally, pushed to `mine`, then the server pulls them.

There's no need to clone `origin` on the server first. `personal-style` is
already `origin/main` plus the personal commits, so cloning the fork's branch
gets everything.

The repo lives *outside* the web root, and only the files are checked out
into it. That keeps `.git` (full history, remote URLs) from being served.

### One-time setup (on the server)

```sh
git clone --bare --branch personal-style --single-branch \
    https://github.com/Ferrisx4/endless-bento.git ~/endless-bento.git
mkdir -p /var/www/bento                # whatever the web root is
```

HTTPS is fine because the fork is public: the server needs no GitHub
credentials and can't push. In this clone, `origin` means the fork, not upstream.

Save as `~/deploy-bento.sh` and `chmod +x` it:

```sh
#!/bin/sh
set -eu
REPO="$HOME/endless-bento.git"
WEBROOT="/var/www/bento"

# '+' accepts the force-pushes that come with rebasing personal-style
git --git-dir="$REPO" fetch -q origin +personal-style:personal-style
git --git-dir="$REPO" --work-tree="$WEBROOT" checkout -q -f personal-style
rm -f "$WEBROOT/PERSONAL_CHANGES.md"   # notes, not part of the site
git --git-dir="$REPO" log -1 --oneline personal-style
```

Run it once to do the first deploy. It prints the commit that's now live.

### Deploying

Locally, after any change to `personal-style` (style update, new personal
commit, or rebase onto upstream):

```sh
git push --force-with-lease mine personal-style
ssh <server> ./deploy-bento.sh
```

The checkout overwrites anything changed by hand in the web root, and removes
files that were deleted from the branch. Files git never tracked are left alone.

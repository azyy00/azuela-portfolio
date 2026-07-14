# Publish your GitHub profile README

The `README.md` in this folder becomes the banner at the top of
**github.com/azyy00** — but only when it lives in a repo named exactly after
your username.

You need to add **two files** to the `azyy00/azyy00` repo: `README.md` and
`banner.png` (the banner image, in this folder). The README references the
banner as `./banner.png`, so both must sit in the repo root.

## Fastest way (web, ~3 minutes)

1. Your `azyy00/azyy00` repo already exists. Open it: **https://github.com/azyy00/azyy00**
2. **Add the banner:** click **Add file → Upload files**, drag in `banner.png`
   from this folder, then **Commit changes**.
3. **Add the README:** open `README.md` → **pencil (Edit)** → select all, delete →
   paste the contents of this folder's `README.md` → **Commit changes**.
4. Visit **https://github.com/azyy00** — the banner and design show at the top.

> If the banner doesn't appear, the file name/case must match exactly
> (`banner.png`, lowercase) and be in the repo **root**, not a subfolder.

## Alternative (command line)

```bash
git clone https://github.com/azyy00/azyy00.git
cd azyy00
# copy this folder's README.md AND banner.png into the repo, then:
git add README.md banner.png
git commit -m "Add profile banner and README"
git push
```

## Before you publish — worth doing

These are optional but they matter for "professional":

1. **Bio & name.** Your profile bio is _"I'm a beginner to this kind of
   platform"_ and your name shows as _"Azyy Ant"_. On
   https://github.com/settings/profile set the name to **Anthony Azuela** and
   the bio to something like _"Full-stack developer & designer · React /
   TypeScript · DataCamp Scholar"_.
2. **Profile photo.** The current avatar is an anime character. A clean headshot
   (or a simple monogram) reads far more professional to recruiters.
3. **Pin your best repos.** On your profile → **Customize your pins** → pick
   `2026-Library-App`, `quiz-app`, `2026-scheduling-app`, `Restaurant1`. Give
   each repo a one-line **description** and a **live link** (repo → About ⚙️)
   so the pinned cards aren't blank.
4. **Contact email.** The README uses your professional address
   (`anthony.azuela.buenaflor@gmail.com`), not the `hatakikirito` one shown on
   your profile. Change either to match whichever you want public.

## Notes on the stat cards

- The **stats card** uses `github-readme-stats` (the free shared instance). It
  renders for most visitors but is occasionally rate-limited (shows a broken
  image for a bit, then recovers). If you want it rock-solid, you can deploy
  your own copy of that project to Vercel and swap the image host — tell me and
  I'll set it up.
- The **streak** and **top-languages** cards, the **skill icons**, the animated
  **typing header**, and all badges are verified working.
- Everything themed to your portfolio's dark + red palette (`#E5484D`).

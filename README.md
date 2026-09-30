# ScaffoldM3C project page

Static site: open `index.html` directly, or serve locally with
`python3 -m http.server` and browse to http://localhost:8000.
Deploys as-is to GitHub Pages (no build step).

```
index.html        main page (overview, stability, method, results, hardware, ablations, resources)
team.html         author page
styles.css        all styles (main + team page)
main.js           sticky nav, play-when-visible videos, tabs, lightbox, BibTeX copy
figures/          paper figures, resized for the web
media/stability/  stability-criterion animations (MP4 + GIF + poster PNG)
videos/           hardware / simulated construction videos, hero clip, posters
logos/ team/      institution logos and author photos
paper/            PDF of the manuscript (not linked from the page)
```

## Regenerating the stability animations

From the parent folder:

```bash
python3 draw_stability_criterion_3d.py --animate --skip-static \
    --output-dir ScaffoldM3C-website/media/stability
```

Drop `--skip-static` to also write the paper figure (PDF/SVG/PNG).
This writes `stability_{a_ground,b_unstable,c_stable,d_scaffold,all}.{mp4,gif,png}`.
Needs `matplotlib`, `numpy`, `Pillow`, `imageio` and `imageio-ffmpeg`.

## TODO before publishing

- arXiv link: the hero button and the Resources "arXiv Preprint" card are placeholders (search `TODO` in `index.html`).
- Code link: same.
- BibTeX: add the arXiv ID once assigned.

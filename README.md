# What Watch Are You?

A cheerful 2016-ish personality quiz that maps your answers to watch design personalities.

## What's new in this build

- 12 questions total.
- Q11 is an art taste test: Madhubani, Pattachitra, Warli and minimalist abstract art.
- Q12 is a watch taste test: artistic, minimalist, elegant and chronograph.
- Added a real **ARTISTIC / EXPRESSIVE** personality score so choosing ornate or colorful visual answers can actually produce an artistic watch.
- Added a little CSS-drawn cat in the top corner.
- Pull/open the cat's folded page corner to reveal a catalogue of **50 watches**.
- Each catalogue card has a type, personality archetype, rough average-price placeholder, and a one-click shopping prompt.
- Catalogue images use real-photo image searches with deterministic lock numbers, plus a fallback image URL so broken sources do not leave blank cards.
- Results use real photographic watch references, with a second real-photo fallback for resilience.
- The result screen still has four copy-to-clipboard shopping prompts.

## How the recommendation engine works

The first ten questions give small integer weights to six personality buckets:

- `adventure`
- `tool`
- `chrono`
- `dress`
- `minimal`
- `artistic`

Q11 and Q12 carry stronger weights because they are direct visual preference tests. The engine then applies a few tiny if-statements before ranking the buckets.

To change the recommendation behavior, edit the `weights` objects near the top of `app.js`.

## Swapping images yourself

All visual question images are plain URL strings inside `QUESTIONS`, so you can replace them directly. Each visual answer also has a `fallback` URL.

The two most important fields look like this:

```js
image: "https://example.com/your-real-photo.jpg",
fallback: "https://example.com/backup-photo.jpg",
```

For catalogue items, the photo query lives in the last field of each row. The page converts that into a deterministic real-photo URL:

```js
["Nomos Tangente", "Minimalist", "minimal", 220000, "Bauhaus typography and thin geometry", "nomos,tangente,watch"]
```

Change that last string to change the visual search language.

## Running it

Open `index.html` in a browser. No build step is required.

## Latest polish

- Catalogue image searches now always include `wristwatch` and use a watch-only fallback, which avoids the old loose search terms that could return unrelated photos.
- The catalogue search field uses the same playful cursive display font as the rest of the site.
- Results now show a floating animated `scroll ↓` cue that fades away when the page is scrolled.

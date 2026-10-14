# Ferrari of the Day

A web page that shows a different Ferrari every day, with a photo and some info from Wikipedia.

![Ferrari of the Day showing today's car](docs/screenshot.png)

Live demo: https://sqnder0.github.io/ferrari-of-the-day/

## Quick start

Open the link above.

## Features

- A new car every day, out of a list of 30 road Ferraris from the 250 GTO to the Purosangue.
- Each car has its Wikipedia photo, a short description, the first paragraph of the article and a link to the full page.
- You can click the calendar icon next to the date to go back to an earlier day.
- Future dates are blocked.
- The same date always gives the same car.

## Running it locally

You need Node.js 20.19+ or 22.12+ for Vite 8. You don't need an API key.

```bash
git clone https://github.com/sqnder0/ferrari-of-the-day.git
cd ferrari-of-the-day
npm install
npm run dev
```

Open http://localhost:5173/ferrari-of-the-day/. The base path is set in `vite.config.js` for GitHub Pages, so the plain `localhost:5173` won't load the page.

`npm run build` puts the site in `dist/`. Pushing to `main` deploys it to GitHub Pages with the workflow in `.github/workflows/deploy.yml`.

## How it works

The cars are a hardcoded list. To pick today's car I count the days since 1970 and take that modulo 30. The tricky bit was counting the days. `date.getTime()` depends on your timezone and daylight saving, so the car could change at the wrong time or be different for someone in another country. I build the date with `Date.UTC` from the local year, month and day instead, so a date always gives the same number.

The date picker has a similar problem. `new Date("2025-03-10")` is read as UTC, which is still March 9 in America. So I split the string and build the date myself. The car info is one request to Wikipedia's summary API, straight from the browser. That's why there's no backend and it can run on GitHub Pages.

## Credits

- Text and photos come from [Wikipedia](https://en.wikipedia.org/). The text is [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/). The photos are on Wikimedia Commons, and each one has its own licence on its file page.
- Built with [Vite](https://vite.dev/) (MIT).
- Ferrari is a trademark of Ferrari S.p.A. This is a fan project and isn't connected to the company.

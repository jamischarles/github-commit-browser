Github Commit Browser
=======

This is a React SPA. React entry file can be found at `src/main.tsx`
Vite is the bundler.

- React 
- React Router 

- Playwright (e2e testing)

Running it locally
========
1. `git clone https://github.com/jamischarles/github-commit-browser.git`
2. `cd github-commit-browser`
3. `npm install`
4. `npm run dev`
5. Open `http://localhost:3000/` in your browser

Tested with Node 16.


Framework context
========
React and React Router work really well for this kind of app. No server needed.
No redux needed.

Testing context
========
Usually I like to have a good mix between integration tests (most), e2e tests (fewer), and unit tests (least).

For this repo I'm mostly using e2e tests via playwright, because the use cases the app supports fits really well into the e2e coverage. 

Next steps
========
Given more time, I'd...
- Improve the design
- Improve tests so it covers all the important use cases
- Improve UX (add spinners, or similar to improve perceived latency) 
- Improve error states & error messaging

Prerequisites

1. Install Node.js (includes node, npm, npx), any version 20+ https://nodejs.org

To start the app

1. `npm ci` (`npm install` if packages are being modified)
2. `npm run dev`

Application on http://localhost:5173/

Naming conventions for syncing with Jira:

- **Branch names**: use the format feature/SCRUM-[Number]-description or bugfix/SCRUM-[Number]-description.
  - Example: `feature/SCRUM-40-GitHub-and-Jira-Sync`
- **Commit messages**: Include the Jira issue key at the start of the commit message.
  - Example: `SCRUM-40: Added issue syncing for GitHub and Jira`
- **Pull request titles** Include the Jira issue key at the start of the title.
  - Example: `SCRUM-40: Create syncing for jira`

Deployment

- `npm ci` (`npm install` if packages are being modified)
- If `<subdomain>.<domain>/<path>/` host url changes (e.g. repository name was modified), ensure `base:` value in `vite.config.js` is equal to `/<path>/`
- `npm run deploy`
- The site should be available on https://Ignas-24.github.io/EngineerClicker/ after some time.

Linting and static analysis:

- Running eslint:

  1. `npm ci` (ensure the correct packages are installed)
  2. `npx eslint .` to run eslint

- Running the fromating tool (Prettier):

  1. `npm ci` (ensure the correct packages are installed)
  2. `npm run format` to run Prettier (or use the Prettier command `npx prettier . --write`)

- Custom rules should be defined in /CustomRules in their own .js file and added to both index.js and eslint.config.js'

- Automated testing with Playwright

  - `npm ci` (ensure the correct packages are installed)
  - `npx playwright install` for the first time running playwright to download the browsers used for testing
  - `npm run dev` (ensure the game is running)
  - `npx playwright test` to run the tests

  - Other useful commands:
    - `npx playwright show-report` to get a html report of the tests ran
    - `npx playwright test --ui` to open the playwright ui for easier debugging

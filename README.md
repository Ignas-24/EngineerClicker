Prerequisites
1. Install Node.js (includes node, npm, npx), any version 20+ https://nodejs.org

To start the app
1. `npm ci` (`npm install` if packages are being modified)
2. `npm run dev`

Application on http://localhost:5173/

Naming conventions for syncing with Jira:

 * **Branch names**: use the format feature/SCRUM-[Number]-description or bugfix/SCRUM-[Number]-description.
    * Example: `feature/SCRUM-40-GitHub-and-Jira-Sync`
* **Commit messages**: Include the Jira issue key at the start of the commit message.
    * Example: `SCRUM-40: Added issue syncing for GitHub and Jira`
* **Pull request titles** Include the Jira issue key at the start of the title.
    * Example: `SCRUM-40: Create syncing for jira`

Deployment
* `npm ci` (`npm install` if packages are being modified)
* If `<subdomain>.<domain>/<path>/` host url changes (e.g. repository name was modified), ensure `base:` value in `vite.config.js` is equal to `/<path>/`
* `npm run deploy`
* The site should be available on https://Ignas-24.github.io/EngineerClicker/ after some time.

Linting and static analysis
1. `npm ci` (ensure the correct packages are installed)
2. `npx eslint .` to run eslint
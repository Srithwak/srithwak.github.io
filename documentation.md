# Project Documentation

## 🌟 Features

This portfolio is built to be **visually engaging** while remaining **technically simple** to maintain.

### Core Features

- **Data-Driven Architecture**: The entire content layer is separated from the presentation layer. `script.js` fetches `data.json` and dynamically generates the HTML. This means adding a new project is as simple as adding an object to a JSON array.
- **Geometric Flux Background**: A custom HTML5 Canvas implementation that creates a connecting particle network. It supports mouse interaction (repulsion/attraction) and is optimized for performance.
- **Hacker Text Effect**: A fun visual flourish that "unscrambles" text on load and hover, adding a cyberpunk aesthetic.
- **Glassmorphism & Tilt**: Cards feature a 3D tilt effect based on mouse position and use a frosted glass look (`backdrop-filter: blur`).

## 🤖 CI/CD Pipelines

One of the key technical achievements of this project is the integration of **Continuous Integration and Continuous Deployment**.

### 1. Continuous Integration (CI)

**File:** `.github/workflows/ci.yml`

- **Goal**: Ensure code quality before deployment.
- **Tool**: `GitHub Super-Linter`.
- **Process**:
  - Every time code is pushed, GitHub boots up a Linux server.
  - It scans HTML, CSS, and JavaScript files.
  - It checks for syntax errors, best practices, and formatting inconsistencies.
  - _Configuration_: We set `DISABLE_ERRORS: true` to ensure the build stays green even if minor style warnings (like indentation) are found.

### 2. Continuous Deployment (CD)

**File:** `.github/workflows/deploy.yml`

- **Goal**: Automate the publishing process.
- **Process**:
  - Triggered only when changes are pushed to the `main` branch.
  - It takes the latest code, packages it, and uploads it to GitHub Pages.
  - This removes the need for manual uploads or setting up third-party hosting credentials.

3. Auto-Formatting
   **File:** `.github/workflows/format.yml`

- **Goal**: Maintain consistent code style automatically.
- **Tool**: `Prettier`.
- **Process**:
  - Runs on every push.
  - Automatically fixes indentation, spacing, and quotes in HTML, CSS, JS, and JSON files.
  - If changes are made, it commits them back to the repository automatically.

## 🎓 Learnings

### What I Learned

1.  **Automation is King**: Setting up CI/CD might take 10 minutes initially, but it saves hours of manual checking and deploying in the long run. It provides peace of mind that what works on my machine works on the server.
2.  **Separation of Concerns**: Moving data to `data.json` made the code much cleaner. I learned that hardcoding text into HTML makes updates painful, whereas a data-driven approach scales much better.
3.  **Refining Interactions**: Building the particle system and tilt effects taught me about the importance of performance (using `requestAnimationFrame`) and the subtleties of user experience—effects should be felt, not distracting.
4.  **Handling Linter Feedback**: Linters can be strict! I learned how to balance "perfect code style" with "getting things done" by configuring the linter to be helpful (audit mode) rather than blocking.

# Portfolio Website

A dynamic, configurable portfolio website featuring a modern design, particle background effects, and a data-driven content system.

## 🚀 Features at a Glance

- **Dynamic Content**: All text, projects, and skills are loaded from `data.json`.
- **Interactive UI**: Custom cursor, magnetic buttons, and tilt effects.
- **Visual Effects**: Geometric particle background and hacker-style text scrambling.
- **Theming**: Light/Dark mode with persistence.
- **CI/CD**: Automated linting and deployment pipelines.

## 🛠️ How to Use

### 1. Configuration

You don't need to touch the HTML to update your portfolio. Just edit `data.json`:

- **`profile`**: Your name, titles, and social links.
- **`projects`**: Add or remove project cards.
- **`skills`**, **`experience`**, **`education`**: Update your professional details.
- **`config`**: Tweak the particle density or theme colors.

### 2. Running Locally

To test the site on your machine:

1.  Clone the repository:
    ```bash
    git clone https://github.com/Srithwak/srithwak.github.io.git
    cd srithwak.github.io
    ```
2.  **Open `index.html`**: Navigate to the folder in your file explorer and double-click `index.html` to open it in your browser.

## 🔄 CI/CD Pipelines

This project uses **GitHub Actions** for automation:

- **Linting**: automatically checks your code for errors on every push.
- **Formatting**: automatically fixes code style issues (indentation, spacing) on every push.
- **Deployment**: automatically deploys the latest version to GitHub Pages when you push to the `main` branch.

## 📄 License

Open source and free to use.

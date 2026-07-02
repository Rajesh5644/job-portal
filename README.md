# Recruitment Platform

A Node.js web application with a public-facing site and an admin panel for managing recruitment content.

## Project Structure

```
.
├── node_modules/            # Installed dependencies
├── public/
│   ├── images/
│   │   ├── hero-bg.jpg      # Hero section background image
│   │   └── recruitment.png  # Recruitment-related graphic
│   ├── admin-dashboard.html # Admin dashboard page
│   ├── admin-login.html     # Admin login page
│   ├── index.html           # Public landing page
│   ├── script.js            # Front-end JavaScript
│   └── style.css            # Front-end styles
├── package.json             # Project metadata and dependencies
├── package-lock.json        # Locked dependency versions
└── server.js                # Application entry point / backend server
```

## Features

- **Public site** (`index.html`) — landing page introducing the platform.
- **Admin login** (`admin-login.html`) — authentication page for administrators.
- **Admin dashboard** (`admin-dashboard.html`) — protected area for managing recruitment data/content.
- **Static assets** served from `public/`, including images used across the site.

## Prerequisites

- [Node.js](https://nodejs.org/) (LTS recommended)
- npm (comes bundled with Node.js)

## Getting Started

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd <repository-folder>
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the server**
   ```bash
   node server.js
   ```
   Or, if a start script is defined in `package.json`:
   ```bash
   npm start
   ```

4. **Open the app**
   Visit `http://localhost:<port>` in your browser (check `server.js` for the configured port).

## Admin Access

Navigate to `/admin-login.html` to sign in as an administrator and access `/admin-dashboard.html`.

> **Note:** Update this section with actual login/setup requirements (e.g., default credentials, environment variables) once confirmed.

## Environment Variables

If `server.js` relies on environment variables (e.g., database URL, session secret, admin credentials), create a `.env` file in the project root:

```
PORT=3000
# Add other required variables here
```

## Tech Stack

- **Backend:** Node.js (see `package.json` for the exact framework/dependencies, e.g., Express)
- **Frontend:** HTML, CSS, JavaScript

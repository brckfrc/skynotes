# SkyNotes: MERN Full Stack Notes Application

This project is a MERN (MongoDB, Express.js, React, Node.js) full-stack web application designed to help you organize and manage your notes.

### 🌐**Live Demo:** [https://skynotes.borak.dev](https://skynotes.borak.dev)

**Project Goal:**

SkyNotes is a minimalist, yet feature-rich MERN stack note-taking application designed to provide users with a seamless experience for organizing their thoughts and ideas. It focuses on intuitive note management including creation, editing, deletion, and quick access via search and pinning functionalities. **A primary long-term goal for this project is to integrate with cloud services (e.g., AWS) for robust data synchronization and scalable deployment.**

**Technologies Used:**

- **Frontend:**
  - React
  - React Router DOM
  - Tailwind CSS
  - React Icons
  - Moment.js (for date formatting)
- **Backend:**
  - Node.js
  - Express.js
  - Mongoose (for MongoDB interactions)
  - JSON Web Token (JWT) (for authentication)
  - dotenv (for environment variables)
  - cors (for enabling Cross-Origin Resource Sharing)
  - nodemon (for development server reloading)
- **Database:** MongoDB
- **Other Tools:**
  - Postman (for testing API requests)

**Features:**

- User Registration and Login (JWT Authentication)
- Create, Edit, and Delete Notes
- Search Notes by title or content
- Pin Notes for quick access
- Responsive Modal Design
- Live Search with Debounce
- Readable Date Format for note timestamps
- Toast Notifications for operations like create, edit, and delete
- Empty Card UI for when there are no notes to display

**Installation and Running:**

1.  **Install the Backend:**

    - Open a terminal and navigate to the `backend` directory.
    - Run `npm install`.
    - **Create a `.env` file in the `backend` directory.**
    - **Add the following environment variable to your `.env` file:**
      `ACCESS_TOKEN_SECRET=your_strong_random_secret_key`
    - Database connection string is located in `config.json` as:
      ```json
      {
        "connectionString": "your_mongodb_connection_string"
      }
      ```
    - Start the backend server by running:
      ```bash
      npm start
      ```

2.  **Install the Frontend:**

    - Open a terminal and navigate to the `frontend` directory.
    - Run `npm install` to install the frontend dependencies.
    - **If your frontend needs a backend API URL, create a `.env` file in the `frontend` directory (e.g., `.env.local`) and add:**
      `VITE_API_BASE_URL=http://localhost:8000` (or your deployed backend URL)
    - Start the frontend development server:
      ```bash
      npm run dev
      ```

3.  Access the application in your browser (typically at `http://localhost:5173` for the frontend and `http://localhost:8000` for the backend).

**Additional Information:**

- The project was created using `npm create vite@latest skynotes-frontend`.
- Tailwind CSS was installed according to the instructions at [https://tailwindcss.com/docs/installation/using-vite](https://tailwindcss.com/docs/installation/using-vite).
- The Noto Sans font from Google Fonts is used: [https://fonts.google.com/selection/embed](https://fonts.google.com/selection/embed)
- The `moment` library is used for date formatting: `npm i moment`
- The following resources were used for visual elements:
  - [https://www.svgrepo.com/vectors/no-note-no-data/](https://www.svgrepo.com/vectors/no-note-no-data/)
  - [https://uxwing.com/no-data-icon/](https://uxwing.com/no-data-icon/)

**Known Issues:**

- The 404 error page is not fully customized yet.

**Development Process Summary:**

- The project was created with React, and pages and components were developed.
- React Router DOM is used for page navigation.
- Styling is done with Tailwind CSS and custom CSS layers.
- Core components such as Navbar, Login screen, Password Input, Search bar, Note Add/Edit Modal, and Tag Input were created.
- A backend API was created using Node.js, Express.js, and Mongoose.
- User and Note models were created.
- Essential API endpoints (user registration, login, note creation, editing, deletion, note retrieval, and note pinning) were developed and connected.
- User information and notes are retrieved from the backend and displayed dynamically.
- **Live search functionality with debouncing was integrated for efficient note filtering.**
- **Note pinning functionality was stabilized to correctly reflect the pinned status visually.**
- **Add/Edit Note modal user experience was improved (responsive design, Escape key closure).**
- Confirmation messages (toasts) have been added for note operations.
- The EmptyCard component is displayed when no notes are found.
- **Addressed and resolved layout issues affecting note card display, particularly during search or with fewer notes.**

## 🚧 Deployment Workflow Status

The GitHub Actions workflow for Elastic Beanstalk deployment (`.github/workflows/deploy-backend-to-eb.yml`) is currently **disabled temporarily**.

**How to Get Support:**

If you have any questions or feedback about the project, please contact me via GitHub.

**Note:** This README file provides a general overview of the project. For more details, please refer to the code files or feel free to open an issue on the GitHub repository.

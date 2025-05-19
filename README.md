# SkyNotes: MERN Full Stack Notes Application

This project is a MERN (MongoDB, Express.js, React, Node.js) full-stack web application designed to help you organize and manage your notes.

**Project Goal:**

This application allows users to create, edit, delete, search, and pin notes. The project aims to showcase both frontend and backend development skills.

**Technologies Used:**

* **Frontend:**
    * React
    * React Router DOM
    * Tailwind CSS
    * React Icons
    * Moment.js (for date formatting)
* **Backend:**
    * Node.js
    * Express.js
    * Mongoose (for MongoDB interactions)
    * JSON Web Token (JWT) (for authentication)
    * dotenv (for environment variables)
    * cors (for enabling Cross-Origin Resource Sharing)
    * nodemon (for development server reloading)
* **Database:** MongoDB
* **Other Tools:**
    * Postman (for testing API requests)

**Features:**

* User Registration and Login (JWT Authentication)
* Create, Edit, and Delete Notes
* Search Notes by title or content
* Pin Notes for quick access
* Readable Date Format for note timestamps
* Toast Notifications for operations like create, edit, and delete
* Empty Card UI for when there are no notes to display

**Installation and Running:**

1.  **Install the Backend:**
    * Open a terminal and navigate to the backend directory.
    * Run `npm install`.
    * Create a `.env` file and set the necessary environment variables (JWT secret).
        `ACCESS_TOKEN_SECRET= your_token`
    * Database connection string is located in `config.json` as:
        ```json
        {
            "connectionString": "your_mongodb_connection_string"
        }
        ```
    * Start the backend server by running:
        ```
        npm start
        ```

2.  **Install the Frontend:**
    * Open a terminal and navigate to the frontend directory.
    * Run `npm install` to install the frontend dependencies.
    * Start the frontend development server:
        ```
        npm run dev
        ```
  
3.  Access the application in your browser (typically at `http://localhost:5173` for the frontend and `http://localhost:8000` for the backend).

**Additional Information:**

* The project was created using `npm create vite@latest skynotes-frontend`.
* Tailwind CSS was installed according to the instructions at [https://tailwindcss.com/docs/installation/using-vite](https://tailwindcss.com/docs/installation/using-vite).
* The Noto Sans font from Google Fonts is used: [https://fonts.google.com/selection/embed](https://fonts.google.com/selection/embed)
* The `moment` library is used for date formatting: `npm i moment`
* The following resources were used for visual elements:
    * [https://www.svgrepo.com/vectors/no-note-no-data/](https://www.svgrepo.com/vectors/no-note-no-data/)
    * [https://uxwing.com/no-data-icon/](https://uxwing.com/no-data-icon/)

**Known Issues:**

* The note pinning function is currently not working as expected.
* The 404 error page is not fully customized yet.
* Some notes might visually shrink after performing a search (temporary issue).
* Search can only be done by hitting "Enter". Future updates will support search via other methods.

**Development Process Summary:**

* The project was created with React, and pages and components were developed.
* React Router DOM is used for page navigation.
* Styling is done with Tailwind CSS.
* Components such as Navbar, Login screen, Password Input, Search bar, Note Add/Edit Modal, and Tag Input were created.
* A backend API was created using Node.js, Express.js, and Mongoose.
* User and Note models were created.
* API endpoints such as user registration, login, note creation, editing, deletion, note retrieval, and note pinning were created.
* API connections between the frontend and backend were established.
* User information is retrieved from the backend and displayed in the Navbar.
* Notes specific to the user are displayed.
* The search function has been added.
* Confirmation messages (toasts) have been added for note addition, editing, and deletion.
* The EmptyCard component is displayed when no notes are found.

**How to Get Support:**

If you have any questions or feedback about the project, please contact me via GitHub.

**Note:** This README file provides a general overview of the project. For more details, please refer to the code files or feel free to open an issue on the GitHub repository.

# Tech Threads

Tech Threads is a blogging platform built using the MERN (MongoDB, Express.js, React, Node.js) stack with additional tooling like Vite for the front-end development. This platform allows admins to create, edit, and publish blog posts and also edit or delete comments and users. It supports rich text editing with syntax highlighting for code snippets using `ReactQuill`.
Go Live on [TechThreads](https://techthreads.onrender.com/)

## Features

- **User Authentication**: Secure user login and registration system.
- **Create,Edit, Delete and Read Posts, Users and Comments**: Admin can create new blog posts, edit and delete existing ones, edit and delete comments and users as well and users can read and add comments on the posts.
- **Rich Text Editor**: Integrated `ReactQuill` for a rich text editing experience.
- **Image Uploads**: Allows admins to upload images for their blog posts with progress feedback.
- **Category Selection**: Users can categorize their blog posts for better organization.
- **Sanitized Content**: Ensures that the content is sanitized to prevent XSS attacks.

## Installation

1. **Clone the Repository**

    ```bash
    git clone https://github.com/yourusername/tech-threads.git
    cd tech-threads
    ```

2. **Install Backend Dependencies**

    ```bash
    cd backend
    npm install
    ```

3. **Install Frontend Dependencies**

    ```bash
    cd ../frontend
    npm install
    ```

4. **Install Highlight.js Dependencies**

    ```bash
    npm install highlight.js
    ```

## Configuration

1. **Environment Variables**

    Create a `.env` file in both the `backend` and `frontend` directories and add the necessary environment variables.

    For backend (`backend/.env`):

    ```env
    PORT=5000
    MONGO_URI=your_mongodb_uri
    JWT_SECRET=your_jwt_secret
    ```

    For frontend (`frontend/.env`):

    ```env
    VITE_API_URL=http://localhost:5000
    ```

## Running the Application

1. **Start the Backend Server**

    ```bash
    cd backend
    npm start
    ```

2. **Start the Frontend Development Server**

    ```bash
    cd frontend
    npm run dev
    ```


## Contributing

Contributions are welcome! Please fork the repository and submit a pull request for review.

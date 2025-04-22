# MindCare AI

## Overview

MindCare AI is a web application designed to provide users with a supportive and engaging chatbot experience. This application uses a combination of front-end technologies (HTML, CSS, JavaScript) and a Node.js backend with a MongoDB database to deliver a conversational AI.

## Features

* **Chat Interface:** A dynamic chat interface enables users to interact with the AI.
* **User Authentication:** Login and signup functionality secures user access.
* **Responsive Design:** A visually appealing and responsive design is enhanced with animated background elements.
* **Text-to-Speech:** The AI's responses can be read aloud to the user.
* **Logout Functionality**: Users can log out of their sessions.

## Technologies Used

* **Frontend:**
    * HTML
    * CSS (with animations)
    * JavaScript
* **Backend:**
    * Node.js
    * Express.js
* **Database:**
    * MongoDB
* **AI Model Provider:**
    * Groq

## Setup Instructions

1.  **Clone the Repository:**

    \* Clone the repository to your local machine.

2.  **Backend Setup:**

    \* Navigate to the server directory: `cd server`
    \* Install the dependencies: `npm install`
    \* Set up your `.env` file
        \* Create a `.env` file in the `server` directory.
        \* Add your MongoDB connection string as `MONGO_URI`.
        \* Add your Session Secret as `SESSION_SECRET`.
        \* Add your Groq API key as `GROQ_API_KEY`
    \* Start the server: `npm run dev` or `node index.js`

3.  **Frontend Setup:**

    \* Navigate to the root directory.
    \* The  `index.html` and `auth.html` files should be served by your Node.js server.  Ensure your Express server is set up to serve static files from the appropriate directory (usually a 'public' folder).

4.  **Database Configuration:**

    \* Ensure your MongoDB database is running and the connection string in `.env` is correct.

## How to Use

1.  **Open the Application:**

    \* Open your web browser and navigate to the application's URL.

2.  **Authentication:**

    \* If you are a new user, sign up for an account on the authentication page.
    \* If you already have an account, log in using your credentials.

3.  **Chat:**

    \* Once logged in, you can interact with the MindCare AI through the chat interface.
    \* Type your message in the input field and press 'Send'.
    \* The AI's response appears in the chatbox.
    \* You can use the "Stop Speech" button to stop the AI from reading the response.
    * You can log out of your session using the "Logout" button.

## File Structure

<pre>
mindcare-ai/
├── server/
│   ├── index.js          # Main server file
│   ├── models/
│   │   ├── User.js       # User schema
│   │   └── Message.js    # Message schema
│   └── \*.js            # Other backend files
├── public/
│   ├── index.html      # Main chat page
│   ├── auth.html       # Authentication page
│   ├── style.css       # Styles for both pages
│   ├── script.js       # Main frontend logic for chat page
│   └── logo.png        # Logo image
</pre>

## Notes

* The application uses a dynamic background animation for an engaging user experience.
* The chat interface displays messages from both the user and the AI.
* The application uses the Groq API to generate AI responses.
* User sessions are managed using Express Session.
* The logout button allows the user to terminate the session.
* The `public/logo.png` file contains the application's logo image.

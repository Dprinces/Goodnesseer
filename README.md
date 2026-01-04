# Goodnesseer

Goodnesseer is an online platform that allows users to ask questions, share thoughts, express emotions, and seek advice anonymously. The platform creates a safe, judgment-free environment where people can receive feedback, empathy, or solutions from others.

## Project Structure

This project is organized as a monorepo with the following structure:

- `client/`: Next.js frontend application
- `server/`: Node.js/Express backend application

## Prerequisites

- Node.js (v18 or higher)
- MongoDB

## Getting Started

### Backend

1. Navigate to the server directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `server` directory and add your MongoDB URI:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/goodnesseer
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

### Frontend

1. Navigate to the client directory:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## Key Features (MVP)

1. **Anonymous Posting**: Users can post questions, thoughts, or feelings without creating a public identity.
2. **Anonymous Replies**: Responses are also anonymous but trackable internally.
3. **Categories/Tags**: Categorize posts (e.g., Mental Health, Relationships, etc.).
4. **Voting/Reaction System**: Upvote/downvote or emojis.
5. **Moderation & Reporting**: Report inappropriate content.
6. **Search and Explore Feed**: Browse trending or recent posts.

## Technologies

- **Frontend**: Next.js, React, Tailwind CSS
- **Backend**: Node.js, Express, MongoDB, Mongoose
- **Authentication**: JWT / Firebase (Optional)
- **Deployment**: Render / Vercel

## License

[License Information]
# Goodnesseer

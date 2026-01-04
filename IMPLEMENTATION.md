# Goodnesseer Implementation Documentation

This document outlines the technical implementation details of the Goodnesseer platform features as of the latest update.

## 1. Architecture Overview

- **Monorepo Structure**:
  - `client/`: Next.js 14+ (App Router), Tailwind CSS, TypeScript.
  - `server/`: Node.js, Express, Mongoose, MongoDB Atlas.
- **Database**: MongoDB Atlas (Cloud) for persistent storage of posts and comments.

## 2. Feature Implementations

### A. Anonymous Identity System
Unlike traditional apps with login screens, Goodnesseer uses a frictionless, semi-persistent identity model:
- **User ID**: A unique random ID is generated on the client-side and stored in `localStorage` (`goodnesseer_user_id`). This ID is sent with requests to enforce "one vote per user" rules without requiring account registration.
- **Aliases**: When posting or commenting, if no alias is provided, the backend assigns a random alias (e.g., "User4821") to maintain anonymity while allowing conversation tracking.

### B. Feed & Discovery
- **Dynamic Feed**: Fetches posts from `/api/posts`.
- **Category Filtering**: 
  - Implemented via a Sidebar component (`CategorySidebar.tsx`).
  - Clicking a category updates the feed query (e.g., `/api/posts?category=Mental%20Health`).
  - **Code Reference**: `client/app/feed/page.tsx`, `client/components/CategorySidebar.tsx`.

### C. Posting System
- **Create Post**: Users can submit text content, select a category (Mental Health, Relationships, etc.), and add tags.
- **Backend Model**: `Post` model includes content, category, tags, and calculated fields for upvotes/downvotes.

### D. Commenting & Reply System
- **Threaded View**: Each post card has a "Replies" section that can be toggled.
- **Anonymous Replies**: Users can reply to posts.
- **Ownership & Editing**:
  - **Token-Based Auth**: When a comment is created, the server generates a secret `editToken`.
  - **Storage**: This token is returned *only* to the creator and stored in the browser's `localStorage` (`goodnesseer_owned_comments`).
  - **Verification**: When editing, the token is sent to the server. The server verifies `comment.editToken === providedToken` before allowing updates.
  - **UI**: An "Edit" button appears only for comments the user owns.

### E. Voting & Reaction Logic
- **Scope**: Available on both Posts and Comments.
- **One Vote Per User**:
  - The backend tracks a `voters` map (UserId -> VoteType) for each entity.
  - **Logic**:
    - *New Vote*: Increment count, save user choice.
    - *Same Vote*: Remove vote (toggle off), decrement count.
    - *Switch Vote*: Swap counts (e.g., Up -> Down: -1 Up, +1 Down), update user choice.
- **Optimistic UI**: The frontend updates the vote count immediately for instant feedback while the server processes the request in the background.

## 3. API Endpoints

### Posts
- `GET /api/posts` - Fetch all posts (supports `?category=X` filter).
- `POST /api/posts` - Create a new post.
- `GET /api/posts/:id` - Get a single post.
- `POST /api/posts/:id/vote` - Vote on a post (Requires `{ type, userId }`).

### Comments
- `GET /api/posts/:id/comments` - Get comments for a post.
- `POST /api/posts/:id/comments` - Add a comment. Returns `editToken`.
- `PUT /api/posts/comments/:commentId` - Edit a comment (Requires `editToken`).
- `POST /api/posts/comments/:commentId/vote` - Vote on a comment (Requires `{ type, userId }`).

## 4. Future Roadmap (Pending)
- Search functionality.
- Report/Flagging system for moderation.
- Time-based sorting (Trending vs New).

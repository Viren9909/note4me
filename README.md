# Message Link Web App

A simple web application that allows users to send messages to each other using their unique profile link.  
Each user can control whether they want to receive new messages by toggling an **"Accept Messages"** setting.  
Authentication and session management are handled with **NextAuth.js**.

## 🚀 Features
- **User Authentication**: Secure login and session management using NextAuth.js.
- **Unique Profile Links**: Each user gets a sharable link (e.g., `/u/username`) for receiving messages.
- **Messaging System**: Users can send messages to others via their profile link.
- **Message Acceptance Toggle**: Receivers can control whether they want to accept incoming messages.
- **Modern Frontend**: Built with Next.js and styled using Tailwind CSS and ShadCN UI.

## 🛠 Tech Stack
- **Frontend**: Next.js, Tailwind CSS, ShadCN UI
- **Authentication**: NextAuth.js
- **Backend**: Next.js API routes (can be extended with Express if needed)
- **Database**: MongoDB with Mongoose

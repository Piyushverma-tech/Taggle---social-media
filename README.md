# Taggle - A Social Media Platform

Taggle is a full-stack social media application built using the MERN (MongoDB, Express.js, React, Node.js) stack. It allows users to connect, share posts, and engage in real-time messaging with full encryption, ensuring privacy and security.

## Features
- **User Authentication:** Secure sign-up and login using JWT authentication.
- **Post Creation & Sharing:** Users can create posts, upload images and videos, and share content.
- **Real-time Messaging:** Instant chat functionality powered by Socket.io.
- **Profile Management:** Users can edit their profiles and manage their activity.
- **Media Uploads:** Securely upload and manage images and videos via Cloudinary.
- **Data Encryption:** Protects user information with bcrypt hashing and JWT security.
- **Responsive UI:** Mobile-friendly and fully responsive design.

## Tech Stack
- **Frontend:** React.js
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Mongoose ODM)
- **Real-time Messaging:** Socket.io
- **Authentication:** JWT, bcrypt
- **File Storage:** Cloudinary
- **State Management:** Context API

## Installation & Setup
### Prerequisites
Ensure you have **Node.js** and **MongoDB** installed on your system.

### Steps to Run Locally
1. **Clone the Repository**
   ```bash
   git clone https://github.com/Piyushverma-tech/taggle.git
   cd taggle
   ```
2. **Set Up Environment Variables**
   Create a `.env` file in the `backend` folder and add the required credentials:
   ```env
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```
3. **Install Dependencies**
   ```bash
   npm install
   cd frontend && npm install
   ```
4. **Run the Application**
   ```bash
   npm run dev
   ```
   The backend runs on `http://localhost:5000` and the frontend on `http://localhost:3000`.

## Future Enhancements
- **Story Feature**
- **Group Chats & Channels**
- **Live Streaming**
- **Dark Mode & UI Customization**

## License
This project is licensed under the MIT License. See the `LICENSE` file for details.

---

### Contributing
Contributions are welcome! Feel free to fork the repo and submit a pull request with improvements.


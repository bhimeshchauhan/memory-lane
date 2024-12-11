
# Memory Lane

Memory Lane is a web application to record and display memorable events in a timeline format. Users can add, edit, and delete memories, view images in a slideshow modal, and toggle favorite status for events. The project is built using React for the frontend and Express.js with SQLite3 for the backend.

---

## Demo



Access the application locally:

- **Frontend**: [http://localhost:5173](http://localhost:5173)
- **Backend**: Runs on [http://localhost:4001](http://localhost:4001)

---

## Features

1. **Add Memories**: Add a new memory with a title, description, date, and images.
2. **Edit Memories**: Edit existing memories while preserving or adding images.
3. **Delete Memories**: Remove memories after confirmation.
4. **Favorite Memories**: Mark memories as favorite and toggle the favorite status.
5. **Image Modal**: View images in a modal slideshow with navigation controls.
6. **Responsive Design**: Works seamlessly across different screen sizes.
7. **Timeline View**: Memories are grouped by months and displayed in a timeline format.

---

## Installation and Setup

Follow these steps to set up and run the project locally:

### 1. Clone the Repository
```bash
git clone <repository-url>
cd memory-lane
```

### 2. Install Dependencies
Install the required dependencies for both the server and client:
```bash
npm install
```

---

## Running the Application

### 1. Seed the Database
Run the database seeder to populate initial data for testing:
```bash
npm run db:seed
```

### 2. Start the API Server
Start the backend server for handling API requests:
```bash
npm run serve:api
```

The server will run on **`http://localhost:4001`**.

### 3. Start the Development Server
Run the React development server for the client:
```bash
npm run dev
```

The client will be accessible at **`http://localhost:5173`**.

---

## Application Structure

### Frontend

- **Language**: TypeScript
- **Framework**: React
- **Styling**: Tailwind CSS, Ant Design
- **Key Components**:
  - **SwivelCard**: Displays individual memory cards with options to edit, delete, and toggle favorite status.
  - **MemoryModal**: Modal for adding or editing memories.
  - **ImageModal**: Modal for viewing images in a slideshow.

### Backend

- **Language**: JavaScript
- **Framework**: Express.js
- **Database**: SQLite3
- **Endpoints**:
  - **GET `/timeline`**: Fetches all memories grouped by month.
  - **POST `/memories`**: Adds a new memory.
  - **PUT `/memories/:id`**: Updates an existing memory.
  - **PATCH `/memories/:id/favorite`**: Toggles the favorite status of a memory.
  - **DELETE `/memories/:id`**: Deletes a memory.

---

## Next Steps

1. **State Management**: Implement Redux or Context API for better state handling.
2. **Testing**: Add unit tests using Jest for frontend and backend.
3. **Enhanced Security**: Integrate authentication and authorization for managing memories.
4. **Deployment**: Deploy the application to platforms like Vercel (frontend) and Heroku (backend).

---

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request for review.

---

## License

This project is licensed under the MIT License.

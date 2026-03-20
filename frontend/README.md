# Exam-builder Frontend Setup Guide

This is the frontend application for Exam-builder. It empowers educators to easily create exams, build sections and questions, and smoothly preview the generated tests. 

Currently, the frontend is architected to operate autonomously by using `localStorage` for all read/write operations. This allows developers and designers to build and refine the user interface using persistent mock data without depending on a running backend.

## Prerequisites
Before you begin, ensure you have the following installed on your machine:
- [Node.js](https://nodejs.org/en) (v14.x or later is recommended)
- **npm** (comes bundled with Node.js)

## 🚀 Installation & Local Development

Follow these steps to get the application fully running locally on your machine:

1. **Navigate to the frontend directory**
   Open your terminal and ensure you are in the `front-end` directory of the project:
   ```bash
   cd path/to/Exam-builder/front-end
   ```

2. **Install all required dependencies**
   Run the following command to download and build all necessary packages for the React environment:
   ```bash
   npm install
   ```

3. **Start the development server**
   Launch the app in development mode by running:
   ```bash
   npm run dev
   ```
   *The application will boot up (usually available at `http://localhost:5173/`). You can click the link provided in the terminal output to open it in your browser.*

---

## 🔗 Connecting to the Backend API

By default, the application is strictly configured to run using mock data. This ensures uninterrupted improvements to the frontend's full functionality while the backend completes integration.

If you are ready to stop using mock data and connect your application to your actual backend server (e.g. the standard Flask/SQLAlchemy Python API), you simply need to restore the actual network request calls.

**Steps to transition from Mock Data to Real Data:**
1. Open the `src/App.jsx` file in your editor.
2. Search through the components for the text flag: `TODO: Uncomment API call when backend is ready`. 
3. Directly beneath these comments, you will find `apiClient` network calls (such as `apiClient.post`, `apiClient.get`, `apiClient.delete`) that have been commented out. **Uncomment** these exact blocks.
4. **Remove or comment out** the mock implementation block that immediately follows it. (e.g. you will see lines executing `JSON.parse(localStorage.getItem(...))` and arrays being modified; these are no longer needed).
5. Ensure your Python backend API is actively running locally. (The VITE configuration expects the API base to be `http://localhost:5050/api/v0` by default).

Once updated and saved, your frontend will successfully communicate with the genuine API interface!

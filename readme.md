# ERP Development

This repository contains the source code for an ERP (Enterprise Resource Planning) system. The project is divided into two main parts: the backend and the frontend.

## Table of Contents

- [ERP Development](#erp-development)
    - [Table of Contents](#table-of-contents)
    - [Project Structure](#project-structure)
    - [Getting Started](#getting-started)
        - [Prerequisites](#prerequisites)
        - [Installation](#installation)
    - [Running the Application](#running-the-application)
        - [Development](#development)
        - [Production](#production)
    - [Environment Variables](#environment-variables)
    - [Technologies Used](#technologies-used)
    - [Contributing](#contributing)
    - [License](#license)

## Project Structure

```
erp/
├── backend/
│   ├── config/
│   ├── models/
│   ├── routes/
│   ├── seedDB.js
│   ├── server.js
│   └── middleware.js
├── frontend/
│   ├── public/
│   ├── src/
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── .env
├── .gitignore
├── package.json
└── README.md
```

## Getting Started

### Prerequisites

Ensure you have the following installed on your machine:

- Node.js (v14 or higher)
- npm (v6 or higher)
- MongoDB (v4 or higher)

### Installation

1. Clone the repository:

     ```sh
     git clone https://github.com/industrial-and-systems-engineering/erp.git
     cd erp
     ```

2. Install backend dependencies:

     ```sh
     npm install
     ```

3. Install frontend dependencies:

     ```sh
     cd ../frontend
     npm install
     ```

## Running the Application

### Development

1. Start the backend server:

     ```sh
     cd ..
     npm run dev
     ```

2. Start the frontend development server:

     ```sh
     cd frontend
     npm run dev
     ```

### Production

1. Build the frontend:

     ```sh
     cd ..
     npm run build
     ```

2. Start the backend server in production mode:

     ```sh
     npm run start
     ```

## Environment Variables

Create a `.env` file in the root directory and add the following environment variables:

```
MONGO_URI=mongodb://localhost:27017/erpdevelopment
PORT=8080
SESSION_SECRET=thisshouldbeabettersecret!
RAZORPAY_KEY_ID=rzp_test_T6N1vi1kjLuL9s
RAZORPAY_SECRET=Dq0cBzdSwMRoJMbC6N4ZUpGn
```

## Technologies Used

- **Backend:**
    - Node.js
    - Express.js
    - MongoDB
    - Mongoose
    - Passport.js

- **Frontend:**
    - React
    - React Router
    - Tailwind CSS
    - Zustand

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes.
4. Commit your changes (`git commit -m 'Add some feature'`).
5. Push to the branch (`git push origin feature-branch`).
6. Open a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

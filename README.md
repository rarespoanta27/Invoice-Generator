# Invoice-Generator

![Node.js](https://img.shields.io/badge/node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![JavaScript](https://img.shields.io/badge/javascript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Express](https://img.shields.io/badge/express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![React](https://img.shields.io/badge/react-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![MUI](https://img.shields.io/badge/MUI-007FFF?style=for-the-badge&logo=mui&logoColor=white)
![MongoDB](https://img.shields.io/badge/mongodb-47A248?style=for-the-badge&logo=mongodb&logoColor=white)


A web application designed for creating and managing invoices with ease. Features secure user authentication, dynamic invoice generation, automatic email sending, and real-time geolocation display. Ideal for individuals and businesses to streamline their invoicing process efficiently.
 

## Features

- User Registration: Register as either an individual or a corporate entity.
- User Login: Secure login with JWT authentication.
- Generate Invoices: Create detailed invoices with product information, transport costs, and total amounts.
- Email Invoices: Invoices are sent via email to the registered user.
- Logout: Users can log out securely.

## Technologies Used

- **Frontend**: React, Material-UI
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Email Service**: Nodemailer
- **PDF Generation**: PDFKit
- **Geolocation API**: OpenCageData

## Installation

### Prerequisites

- Node.js and npm installed on your machine
- MongoDB installed and running locally

### Steps

1. Clone the repository:
   ```bash
   git clone https://github.com/rarespoanta27/invoice-generator.git
   cd invoice-generator

2. Install dependencies for both client and server:
   ```bash
   npm install
   cd client
   npm install
   cd ..

3. Start the server:
   ```bash
   npm run server

4. Start the client:
   ```bash
   cd client
   npm start

## Usage

1. **Register:** Visit /register to create a new account. Select your account type (individual or corporate) and fill in the required details.
2. **Login:** Visit /login to log into your account using your registered email and password.
3. **Generate Invoice:** Once logged in, navigate to /generate-invoice. Fill in the product details, transport cost, and generate the invoice.
4. **Logout:** Use the logout button to securely log out of your account.

## Folder Structure

- client: Contains the React frontend code.
  - src: Contains the source code for the React application.
    - Main components like: Login, Register, and GenerateInvoice.
    - App.js: Main component that sets up the routes.
- server: Contains the Node.js backend code.
  - index.js: Entry point for the server.
  - models: Contains the MongoDB models for User and Invoice.
 
## API Endpoints

- **POST /register:** Register a new user.
- **POST /login:** Log in a user and return a JWT token.
- **POST /generate-invoice:** Generate an invoice and send it via email.

## License

This project is licensed under the MIT License.

## Contact

If you have any questions, feel free to reach out at rarespoanta10@gmail.com.

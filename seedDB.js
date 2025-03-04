const mongoose = require('mongoose');
const Technician = require('./backend/models/technician');
const Admin = require('./backend/models/admin');
const dotenv = require('dotenv');
dotenv.config();

mongoose.connect(process.env.MONGO_URI, {})
    .then(() => console.log("Database connected"))
    .catch(err => console.log(err));

const seedDB = async () => {
    try {

        // Create dummy technician
        await Technician.register(
            { username: "pspkmahali", email: "pspk.prasad2004@gmail.com", userType: "technician" },
            "123"
        );

        // Create dummy admin
        await Admin.register(
            { username: "adminuser", email: "admin@example.com" },
            "adminpassword"
        );

        console.log("Dummy data inserted successfully!");
        mongoose.connection.close();
    } catch (err) {
        console.error("Error seeding database:", err);
    }
};

// Run the function
seedDB();

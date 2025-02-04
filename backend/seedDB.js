const mongoose = require('mongoose');
const Technician = require('./models/technician');
const Admin = require('./models/admin');

mongoose.connect('mongodb://localhost:27017/erpdevelopment', {})
    .then(() => console.log("Database connected"))
    .catch(err => console.log(err));

const seedDB = async () => {
    try {
        // Remove existing data
        await Technician.deleteMany({});
        await Admin.deleteMany({});

        // Create dummy technician
        await Technician.register(
            { username: "techuser", email: "tech@example.com", userType: "technician" },
            "techpassword"
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

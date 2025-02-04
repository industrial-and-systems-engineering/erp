import React from "react";
const Uhomepage = () => {

  return (
    <div>
      <h1 className="text-2xl font-bold text-center my-15">User Homepage</h1>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-2">Profile</h2>
            <p>View and edit your profile information.</p>
            <button className="mt-4 bg-blue-500 text-white py-2 px-4 rounded">Go to Profile</button>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-2">Settings</h2>
            <p>Manage your account settings and preferences.</p>
            <button className="mt-4 bg-blue-500 text-white py-2 px-4 rounded">Go to Settings</button>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-2">Notifications</h2>
            <p>Check your recent notifications.</p>
            <button className="mt-4 bg-blue-500 text-white py-2 px-4 rounded">View Notifications</button>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-2">Messages</h2>
            <p>Read your messages and communicate with others.</p>
            <button className="mt-4 bg-blue-500 text-white py-2 px-4 rounded">Go to Messages</button>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-2">Support</h2>
            <p>Get help and support for your account.</p>
            <button className="mt-4 bg-blue-500 text-white py-2 px-4 rounded">Contact Support</button>
          </div>
        </div>
      </div>
    </div>

  );
};

export default Uhomepage;

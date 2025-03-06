import React from 'react'

const Cschomepage = () => {
  return (
    <div className="container" >
      <h1 className="text-2xl font-bold mb-4 text-center">CSC Page</h1>
      <div className="mt-4">
        <p className="text-lg">Welcome to the CSC Home Page. Here you can find essential details about your tasks.</p>
        <div className="mt-6">
          <h2 className="text-2xl font-semibold text-gray-700">Task Summary</h2>
          <p className="mt-2 text-lg">Completed Products: 10</p>
          <p className="mt-1 text-lg">Pending Products: 5</p>
        </div>
      </div>
    </div>
  )
}

export default Cschomepage
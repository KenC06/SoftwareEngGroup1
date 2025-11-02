import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
      <div className="max-w-screen-md my-6 mx-auto">
          <h1 className="text-4xl text-center">Home</h1>
          <div className="rounded-md border-2 border-black text-center m-4">
            <Link to="/inventory">
                <p className="text-xl font-bold">Track Item Inventory</p>
                <p>Add, remove, or change quantity of items in your inventory.</p>
            </Link>
          </div>
          <div className="rounded-md border-2 border-black text-center m-4">
            <Link to="/notifications">
                <p className="text-xl font-bold">Notifications</p>
                <p>View items that are expiring soon or are low stock.</p>
            </Link>
          </div>
          <div className="rounded-md border-2 border-black text-center m-4">
            <Link to="/shoppinglist">
                <p className="text-xl font-bold">Shopping List</p>
                <p>Generate a shopping list with low stock items</p>
            </Link>
          </div>
      </div>
  );
}

export default Home;

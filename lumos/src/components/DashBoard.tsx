import React from 'react';
import SideBar from './SideBar';

const DashBoard = () => {
  return (
    <div className="flex">
      <SideBar />
      <div className="flex-1 p-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p>Welcome to the Dashboard! Here you can see all the content.</p>
      </div>
    </div>
  );
};

export default DashBoard;

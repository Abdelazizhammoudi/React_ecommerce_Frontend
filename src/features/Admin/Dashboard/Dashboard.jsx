import React from 'react';

const Dashboard = () => {
    return (
        <div className="dashboard">
            <h1>Dashboard</h1>
            <div className="dashboard-sections">
                <div className="dashboard-card">
                    <h2>Overview</h2>
                    <p>Summary of your store's performance.</p>
                </div>
                <div className="dashboard-card">
                    <h2>Orders</h2>
                    <p>Track and manage customer orders.</p>
                </div>
                <div className="dashboard-card">
                    <h2>Products</h2>
                    <p>Manage your product inventory.</p>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
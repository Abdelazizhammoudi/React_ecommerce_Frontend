import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import OrderList from '@/features/Order/OrderList/OrderList';

const Dashboard = () => {
    const [viewOrders, setViewOrders] = useState(false);

    if (viewOrders) {
        // Navigate to the OrderList component inside the dashboard
        return <OrderList />;
    }

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
                    {/* Use a button to trigger navigation */}
                    <button
                        onClick={() => setViewOrders(true)}
                        className="dashboard-link"
                    >
                        View Orders
                    </button>
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
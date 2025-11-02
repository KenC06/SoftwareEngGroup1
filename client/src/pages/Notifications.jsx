import React from "react";
import ExpiryAlerts from "./components/ExpiryAlerts";
import LowStockAlerts from "./components/LowStockAlerts";
import NavBar from "./components/NavBar";

function Home() {
    return (
        <div className="max-w-screen-md my-6 mx-auto">
            <NavBar name="Notifications" />
            <ExpiryAlerts />
            <LowStockAlerts />
        </div>
    );
}

export default Home;

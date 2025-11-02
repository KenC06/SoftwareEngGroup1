import React, { useState, useEffect } from "react";

const LowStockAlerts = () => {
  const [lowStockItems, setLowStockItems] = useState([]);

  useEffect(() => {
    fetchLowStockItems();
  }, []);

  const fetchLowStockItems = async () => {
    try {
      const response = await fetch("http://localhost:3001/items/low_stock");
      const items = await response.json();
      setLowStockItems(items);
    } catch (error) {
      console.error("Error fetching low stock items:", error);
    }
  };

  if (lowStockItems.length === 0) {
    return null;
  }

  return (
    <div
      style={{
        background: "#fff3cd",
        border: "1px solid #ffeaa7",
        borderRadius: "8px",
        padding: "1rem",
        margin: "1rem 0",
      }}
    >
      <h4 style={{ color: "#856404", margin: "0 0 1rem 0" }}>
        ⚠️ Low Stock Items
      </h4>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        {lowStockItems.map((item) => (
          <div
            key={item.id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "0.5rem",
              background: "white",
              borderRadius: "4px",
            }}
          >
            <div>
              <strong>{item.name}</strong>
              {(
                <span
                  style={{
                    color: "#666",
                    fontSize: "0.875rem",
                    marginLeft: "0.5rem",
                  }}
                >
                  (Threshold: {item.low_stock_threshold})
                </span>
              )}
            </div>
            <div
              style={{
                color:
                item.quantity <= item.low_stock_threshold/2
                    ? "#dc3545"
                    : "#856404",
                fontWeight: "bold",
              }}
            >
              {item.quantity} in stock
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LowStockAlerts;

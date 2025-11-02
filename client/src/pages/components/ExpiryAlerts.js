import React, { useState, useEffect } from 'react';

const ExpiryAlerts = () => {
  const [expiringItems, setExpiringItems] = useState([]);

  useEffect(() => {
    fetchExpiringItems();
  }, []);

  const fetchExpiringItems = async () => {
    try {
      const response = await fetch('http://localhost:3001/items/expiring_soon');
      const items = await response.json();
      setExpiringItems(items);
    } catch (error) {
      console.error('Error fetching expiring items:', error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const daysUntilExpiry = (expiryDate) => {
    const expiry = new Date(expiryDate);
    const today = new Date();
    const diffTime = expiry - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  if (expiringItems.length === 0) {
    return null;
  }

  return (
    <div style={{ 
      background: '#fff3cd', 
      border: '1px solid #ffeaa7', 
      borderRadius: '8px', 
      padding: '1rem', 
      margin: '1rem 0' 
    }}>
      <h4 style={{ color: '#856404', margin: '0 0 1rem 0' }}>
        ⚠️ Items Expiring Soon
      </h4>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {expiringItems.map(item => (
          <div key={item.id} style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            padding: '0.5rem',
            background: 'white',
            borderRadius: '4px'
          }}>
            <div>
              <strong>{item.name}</strong> - 
              Expires: {formatDate(item.expiry_date)}
              {item.reminder_days_before && (
                <span style={{ color: '#666', fontSize: '0.875rem', marginLeft: '0.5rem' }}>
                  (Reminder: {item.reminder_days_before} days before)
                </span>
              )}
            </div>
            <div style={{ 
              color: daysUntilExpiry(item.expiry_date) <= 3 ? '#dc3545' : '#856404',
              fontWeight: 'bold'
            }}>
              {daysUntilExpiry(item.expiry_date)} days left
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExpiryAlerts;
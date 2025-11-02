import React, { useState, useEffect } from 'react';

const ItemForm = ({ editingItem, onSaveItem, onCancel }) => {
  const [item, setItem] = useState({
    name: '',
    quantity: 1,
    expiry_date: '',
    reminder_days_before: null
  });

  useEffect(() => {
    if (editingItem) {
      setItem({
        ...editingItem,
        expiry_date: editingItem.expiry_date || '',
        reminder_days_before: editingItem.reminder_days_before || null
      });
    } else {
      setItem({
        name: '',
        quantity: 1,
        expiry_date: '',
        reminder_days_before: null
      });
    }
  }, [editingItem]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSaveItem(item);
  };

  const minDate = new Date().toISOString().split('T')[0];

  return (
    <div className="item-form">
      <h3>{editingItem ? 'Edit Item' : 'Add New Item'}</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="itemName">Item Name *</label>
          <input
            id="itemName"
            type="text"
            value={item.name}
            onChange={(e) => setItem({...item, name: e.target.value})}
            required
            className="form-control"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="itemQuantity">Quantity</label>
          <input
            id="itemQuantity"
            type="number"
            min="0"
            value={item.quantity}
            onChange={(e) => setItem({...item, quantity: parseInt(e.target.value) || 0})}
            className="form-control"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="expiryDate">Expiry Date</label>
          <input
            id="expiryDate"
            type="date"
            min={minDate}
            value={item.expiry_date}
            onChange={(e) => setItem({...item, expiry_date: e.target.value})}
            className="form-control"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="reminderDays">Remind Me (Days Before)</label>
          <select
            id="reminderDays"
            value={item.reminder_days_before || ''}
            onChange={(e) => setItem({...item, reminder_days_before: e.target.value ? parseInt(e.target.value) : null})}
            className="form-control"
          >
            <option value="">No reminder</option>
            <option value="1">1 day before</option>
            <option value="2">2 days before</option>
            <option value="3">3 days before</option>
            <option value="7">1 week before</option>
            <option value="14">2 weeks before</option>
          </select>
          <small className="text-muted">
            You'll be notified when the item is close to expiring
          </small>
        </div>
        
        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            {editingItem ? 'Update' : 'Add'} Item
          </button>
          {editingItem && (
            <button type="button" onClick={onCancel} className="btn btn-secondary">
              Cancel
            </button>
          )}
        </div>

        // Add these fields to your form (where you have name, quantity, etc.)

{/* Expiry Date Field */}
<div style={{ marginBottom: '1rem' }}>
  <label style={{ display: 'block', marginBottom: '0.5rem' }}>
    Expiry Date:
  </label>
  <input
    type="date"
    min={new Date().toISOString().split('T')[0]}
    value={item.expiry_date || ''}
    onChange={(e) => setItem({...item, expiry_date: e.target.value})}
    style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' }}
  />
</div>

{/* Reminder Days Field */}
<div style={{ marginBottom: '1rem' }}>
  <label style={{ display: 'block', marginBottom: '0.5rem' }}>
    Remind Me (Days Before):
  </label>
  <select
    value={item.reminder_days_before || ''}
    onChange={(e) => setItem({...item, reminder_days_before: e.target.value ? parseInt(e.target.value) : null})}
    style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' }}
  >
    <option value="">No reminder</option>
    <option value="1">1 day before</option>
    <option value="2">2 days before</option>
    <option value="3">3 days before</option>
    <option value="7">1 week before</option>
    <option value="14">2 weeks before</option>
  </select>
  <small style={{ color: '#666', fontSize: '0.875rem' }}>
    Get notified before items expire to reduce waste
  </small>
</div>
      </form>
    </div>
  );
};

export default ItemForm;
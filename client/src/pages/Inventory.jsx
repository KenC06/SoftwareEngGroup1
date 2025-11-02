import { useEffect, useState } from "react";
import { getItems, createItem, updateItem, deleteItem } from "../api";
import ExpiryAlerts from './components/ExpiryAlerts';

export default function Inventory() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ 
    name: "", 
    quantity: 1,
    expiry_date: "",
    reminder_days_before: ""
  });
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const { data } = await getItems();
    setItems(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const add = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    await createItem({ 
      name: form.name.trim(), 
      quantity: Number(form.quantity)||0,
      expiry_date: form.expiry_date || null,
      reminder_days_before: form.reminder_days_before ? parseInt(form.reminder_days_before) : null
    });
    setForm({ name: "", quantity: 1, expiry_date: "", reminder_days_before: "" });
    load();
  };

  const inc = async (it) => { await updateItem(it.id, { quantity: it.quantity + 1 }); load(); };
  const dec = async (it) => { await updateItem(it.id, { quantity: Math.max(0, it.quantity - 1) }); load(); };
  const removeItem = async (it) => { await deleteItem(it.id); load(); };

  // Function to render expiry info for an item
  const renderExpiryInfo = (item) => {
    if (!item.expiry_date) return null;
    
    const daysLeft = Math.ceil((new Date(item.expiry_date) - new Date()) / (1000 * 60 * 60 * 24));
    
    return (
      <div style={{ marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid #eee', fontSize: '0.875rem' }}>
        <div><strong>Expires:</strong> {new Date(item.expiry_date).toLocaleDateString()}</div>
        {item.reminder_days_before && (
          <div><strong>Reminder:</strong> {item.reminder_days_before} days before</div>
        )}
        {daysLeft >= 0 ? (
          <div style={{ color: daysLeft <= 3 ? '#dc3545' : '#28a745', fontWeight: 'bold' }}>
            {daysLeft} days remaining
          </div>
        ) : (
          <div style={{ color: '#dc3545', fontWeight: 'bold' }}>EXPIRED</div>
        )}
      </div>
    );
  };

  if (loading) return <p style={{padding:16}}>Loading…</p>;

  return (
    <div style={{maxWidth:720, margin:"24px auto", fontFamily:"system-ui, sans-serif"}}>
      <h1>Inventory</h1>

      {/* Add ExpiryAlerts component */}
      <ExpiryAlerts />

      <form onSubmit={add} style={{display:"flex", flexDirection:"column", gap:8, margin:"16px 0"}}>
  <div style={{display:"flex", gap:8}}>
    <input
      placeholder="Item name"
      value={form.name}
      onChange={e=>setForm(v=>({...v, name:e.target.value}))}
      style={{flex:1, padding:8}}
    />
    <input
      type="number"
      min="0"
      value={form.quantity}
      onChange={e=>setForm(v=>({...v, quantity:e.target.value}))}
      style={{width:100, padding:8}}
    />
    <button>Add</button>
  </div>
  
  {/* ADD THESE EXPIRY FIELDS */}
  <div style={{display:"flex", gap:8, fontSize:"0.875rem"}}>
    <div style={{flex:1}}>
      <label>Expiry Date:</label>
      <input
        type="date"
        min={new Date().toISOString().split('T')[0]}
        value={form.expiry_date || ''}
        onChange={e=>setForm(v=>({...v, expiry_date:e.target.value}))}
        style={{width:"100%", padding:4, marginTop:4}}
      />
    </div>
    <div style={{flex:1}}>
      <label>Remind (Days Before):</label>
      <select
        value={form.reminder_days_before || ''}
        onChange={e=>setForm(v=>({...v, reminder_days_before:e.target.value}))}
        style={{width:"100%", padding:4, marginTop:4, height: "60%"}}
      >
        <option value="">No reminder</option>
        <option value="1">1 day before</option>
        <option value="2">2 days before</option>
        <option value="3">3 days before</option>
        <option value="7">1 week before</option>
        <option value="14">2 weeks before</option>
        <option value="21">3 weeks before</option>
      </select>
    </div>
  </div>
</form>

      {items.length === 0 ? <p>No items yet.</p> : (
        <ul style={{listStyle:"none", padding:0, margin:0}}>
          {items.map(it=>(
            <li key={it.id} style={{padding:"12px 0", borderBottom:"1px solid #eee"}}>
              <div style={{display:"flex", alignItems:"center", gap:8}}>
                <strong style={{flex:1}}>{it.name}</strong>
                <button onClick={()=>dec(it)}>-</button>
                <span style={{width:32, textAlign:"center"}}>{it.quantity}</span>
                <button onClick={()=>inc(it)}>+</button>
                <button onClick={()=>removeItem(it)} style={{marginLeft:8}}>Delete</button>
              </div>
              {/* Add expiry info for each item */}
              {renderExpiryInfo(it)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
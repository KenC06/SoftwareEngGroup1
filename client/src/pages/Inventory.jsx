import { useEffect, useState } from "react";
import { getItems, createItem, updateItem, deleteItem } from "../api";
import NavBar from "./components/NavBar";

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
    <div className="max-w-screen-md my-6 mx-auto">
      <NavBar name="Inventory" />

      <form onSubmit={add} className="flex flex-col gap-2 my-4">
  <div className="flex gap-2">
    <input
      placeholder="Item name"
      value={form.name}
      onChange={e=>setForm(v=>({...v, name:e.target.value}))}
      className="flex-1 p-2"
    />
    <input
      type="number"
      min="0"
      value={form.quantity}
      onChange={e=>setForm(v=>({...v, quantity:e.target.value}))}
      className="w-24 p-2"
    />
    <button>Add</button>
  </div>
  
  {/* ADD THESE EXPIRY FIELDS */}
  <div className="flex gap-2 text-sm mt-4">
    <div className="flex-1">
      <label>Expiry Date:</label>
      <input
        type="date"
        min={new Date().toISOString().split('T')[0]}
        value={form.expiry_date || ''}
        onChange={e=>setForm(v=>({...v, expiry_date:e.target.value}))}
        className="w-full p-1 mt-1"
      />
    </div>
    <div className="flex-1">
      <label>Remind (Days Before):</label>
      <select
        value={form.reminder_days_before || ''}
        onChange={e=>setForm(v=>({...v, reminder_days_before:e.target.value}))}
        className="w-full p-1 mt-1 h-[60%]"
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
        <ul className="list-none p-0 m-0">
          {items.map(it=>(
            <li key={it.id} className="py-3 border-b border-[#eee]">
              <div className="flex items-center gap-2">
                <strong className="flex-1">{it.name}</strong>
                <button onClick={()=>dec(it)}>-</button>
                <span className="w-8 text-center">{it.quantity}</span>
                <button onClick={()=>inc(it)}>+</button>
                <button onClick={()=>removeItem(it)} className="ml-2">Delete</button>
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

import { useEffect, useState } from "react";
import { getItems, createItem, updateItem, deleteItem } from "../api";

export default function Inventory() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ name: "", quantity: 1 });
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
    await createItem({ name: form.name.trim(), quantity: Number(form.quantity)||0 });
    setForm({ name: "", quantity: 1 });
    load();
  };

  const inc = async (it) => { await updateItem(it.id, { quantity: it.quantity + 1 }); load(); };
  const dec = async (it) => { await updateItem(it.id, { quantity: Math.max(0, it.quantity - 1) }); load(); };
  const removeItem = async (it) => { await deleteItem(it.id); load(); };

  if (loading) return <p style={{padding:16}}>Loading…</p>;

  return (
    <div style={{maxWidth:720, margin:"24px auto", fontFamily:"system-ui, sans-serif"}}>
      <h1>Inventory</h1>

      <form onSubmit={add} style={{display:"flex", gap:8, margin:"16px 0"}}>
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
      </form>

      {items.length === 0 ? <p>No items yet.</p> : (
        <ul style={{listStyle:"none", padding:0, margin:0}}>
          {items.map(it=>(
            <li key={it.id} style={{display:"flex", alignItems:"center", gap:8, padding:"8px 0", borderBottom:"1px solid #eee"}}>
              <strong style={{flex:1}}>{it.name}</strong>
              <button onClick={()=>dec(it)}>-</button>
              <span style={{width:32, textAlign:"center"}}>{it.quantity}</span>
              <button onClick={()=>inc(it)}>+</button>
              <button onClick={()=>removeItem(it)} style={{marginLeft:8}}>Delete</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

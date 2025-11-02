import { useEffect, useState } from "react";
import { getLowStockItems, getListItems, createListItem, updateListItem, deleteListItem } from "../api";
import NavBar from "./components/NavBar";

export default function ShoppingList() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({
    name: "",
    quantity: 1
  });
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const { data } = await getListItems();
    setItems(data);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const add = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    await createListItem({
      name: form.name.trim(),
      quantity: Number(form.quantity) || 0,
    });
    setForm({
      name: "",
      quantity: 1,
    });
    load();
  };

  const hasId = (array, idToFind) => {
    return array.some(obj => obj.item_id === idToFind);
  };

  const addLowStock = async () => {
    const lowStock = await getLowStockItems();
    for (let item of lowStock.data) {
      if (!hasId(items, item.id)) {
        await createListItem({name: item.name, quantity: item.low_stock_threshold + 1, item_id: item.id});
      }
    }
    load();
  }

  const inc = async (it) => {
    await updateListItem(it.id, { quantity: it.quantity + 1 });
    load();
  };
  const dec = async (it) => {
    await updateListItem(it.id, { quantity: Math.max(0, it.quantity - 1) });
    load();
  };
  const removeItem = async (it) => {
    await deleteListItem(it.id);
    load();
  };

  if (loading) return <p style={{ padding: 16 }}>Loading…</p>;

  return (
    <div className="max-w-screen-md my-6 mx-auto">
      <NavBar name="Shopping List" />

      <form onSubmit={add} className="flex flex-col gap-2 my-4">
        <div className="flex gap-2">
          <input
            placeholder="Item name"
            value={form.name}
            onChange={(e) => setForm((v) => ({ ...v, name: e.target.value }))}
            className="flex-1 p-2 border rounded"
          />
          <input
            type="number"
            min="0"
            value={form.quantity}
            onChange={(e) =>
              setForm((v) => ({ ...v, quantity: e.target.value }))
            }
            className="w-24 p-2 border rounded"
          />
          <button className="rounded bg-green-600 w-20 text-white">Add</button>
        </div>
      </form>

      <div className="flex justify-center">
        <button onClick={() => addLowStock()} className="rounded bg-yellow-600 text-white p-2">Add Low Stock Items</button>
      </div>

      {items.length === 0 ? (
        <p>No items yet.</p>
      ) : (
        <ul className="list-none p-0 m-0">
          {items.map((it) => (
            <li key={it.id} className="py-3 border-b border-[#eee]">
              <div className="flex items-center gap-2">
                <strong className="flex-1">{it.name}</strong>
                <button onClick={() => dec(it)}>-</button>
                <span className="w-8 text-center">{it.quantity}</span>
                <button onClick={() => inc(it)}>+</button>
                <button onClick={() => removeItem(it)} className="ml-2">
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

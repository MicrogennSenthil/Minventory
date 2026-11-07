'use client';
import { useCallback, useEffect, useState } from 'react';

interface ItemCategory { id: string; code: string; name: string; is_active: boolean }

const API = process.env.NEXT_PUBLIC_API_URL || '';

export default function ItemCategories() {
  const [token, setToken] = useState('');
  const [rows, setRows] = useState<ItemCategory[]>([]);
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    try { setToken(sessionStorage.getItem('minv_token') || ''); } catch (e) { /* storage blocked */ }
  }, []);

  const call = useCallback(async (path: string, init?: RequestInit) => {
    const res = await fetch(API + '/api/v1/masters/item-categories' + path, {
      ...init,
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
    });
    if (!res.ok) throw new Error('Request failed (' + res.status + ')');
    return res.status === 204 ? null : res.json();
  }, [token]);

  const load = useCallback(async () => {
    if (!token) return;
    try { setError(''); setRows(await call('')); } catch (e: any) { setError(e.message); }
  }, [token, call]);

  useEffect(() => { load(); }, [load]);

  async function add() {
    try {
      setError('');
      await call('', { method: 'POST', body: JSON.stringify({ code, name }) });
      setCode(''); setName(''); load();
    } catch (e: any) { setError(e.message); }
  }

  async function remove(id: string) {
    try { await call('/' + id, { method: 'DELETE' }); load(); } catch (e: any) { setError(e.message); }
  }

  function saveToken(v: string) {
    setToken(v);
    try { sessionStorage.setItem('minv_token', v); } catch (e) { /* storage blocked */ }
  }

  return (
    <>
      <h1>Item Categories</h1>
      <div className="row">
        <input placeholder="Access token (temporary until login screen)" value={token} onChange={(e) => saveToken(e.target.value)} />
      </div>
      <div className="row">
        <input placeholder="Code" value={code} onChange={(e) => setCode(e.target.value)} />
        <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <button onClick={add} disabled={!code || !name}>Add</button>
      </div>
      {error && <div className="err">{error}</div>}
      <div className="list">
        {rows.map((r) => (
          <div className="item" key={r.id}>
            <span><strong>{r.code}</strong> · {r.name}</span>
            <button className="ghost" onClick={() => remove(r.id)}>Delete</button>
          </div>
        ))}
        {rows.length === 0 && token && !error && <div className="card">No categories yet.</div>}
      </div>
    </>
  );
}

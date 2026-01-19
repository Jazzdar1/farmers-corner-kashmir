
import React, { useState, useEffect } from 'react';
import { 
  Lock, Mail, Key, ShieldCheck, Plus, Edit, Trash2, 
  LayoutDashboard, Settings, User, X, Check, Save, 
  Globe, Store, Warehouse, CloudSun, BookOpen, AlertCircle 
} from 'lucide-react';

type AdminTab = 'knowledge' | 'weather' | 'mandi' | 'ca';

const Admin: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<AdminTab>('knowledge');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  // Data States
  const [knowledge, setKnowledge] = useState<any[]>([]);
  const [districts, setDistricts] = useState<string[]>([]);
  const [mandis, setMandis] = useState<any[]>([]);
  const [caStorages, setCaStorages] = useState<any[]>([]);

  // Load Initial Data
  useEffect(() => {
    const savedKnowledge = localStorage.getItem('fck_knowledge');
    const savedDistricts = localStorage.getItem('fck_districts');
    const savedMandis = localStorage.getItem('fck_mandis');
    const savedCA = localStorage.getItem('fck_ca');

    if (savedKnowledge) setKnowledge(JSON.parse(savedKnowledge));
    if (savedDistricts) setDistricts(JSON.parse(savedDistricts));
    if (savedMandis) setMandis(JSON.parse(savedMandis));
    if (savedCA) setCaStorages(JSON.parse(savedCA));
  }, []);

  // Save Helpers
  const saveToStorage = (key: string, data: any) => {
    localStorage.setItem(key, JSON.stringify(data));
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === 'admin@fck' && password === 'fck@123') {
      setIsLoggedIn(true);
      setError('');
    } else {
      setError('Invalid credentials. High-security protocol active.');
    }
  };

  const handleDelete = (id: any, list: any[], setList: any, key: string) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    const newList = typeof id === 'string' && activeTab === 'weather' 
      ? list.filter(item => item !== id)
      : list.filter(item => item.id !== id && item.name !== id && item.title !== id);
    setList(newList);
    saveToStorage(key, newList);
  };

  const openForm = (item: any = null) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const data = Object.fromEntries(formData.entries());

    if (activeTab === 'knowledge') {
      const newItem = { ...data, id: editingItem?.id || Date.now().toString(), tags: (data.tags as string).split(',') };
      const newList = editingItem ? knowledge.map(k => k.id === editingItem.id ? newItem : k) : [...knowledge, newItem];
      setKnowledge(newList);
      saveToStorage('fck_knowledge', newList);
    } else if (activeTab === 'weather') {
      const newList = editingItem ? districts.map(d => d === editingItem ? data.name as string : d) : [...districts, data.name as string];
      setDistricts(newList);
      saveToStorage('fck_districts', newList);
    } else if (activeTab === 'mandi') {
      const newItem = { ...data, id: editingItem?.id || Date.now().toString() };
      const newList = editingItem ? mandis.map(m => m.id === editingItem.id ? newItem : m) : [...mandis, newItem];
      setMandis(newList);
      saveToStorage('fck_mandis', newList);
    } else if (activeTab === 'ca') {
      const newItem = { ...data, id: editingItem?.id || Date.now().toString() };
      const newList = editingItem ? caStorages.map(c => c.id === editingItem.id ? newItem : c) : [...caStorages, newItem];
      setCaStorages(newList);
      saveToStorage('fck_ca', newList);
    }

    setIsModalOpen(false);
    setEditingItem(null);
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-6">
        <div className="bg-white w-full max-w-md rounded-[3rem] shadow-2xl border border-slate-100 p-10 space-y-8 animate-in zoom-in-95 duration-500">
          <div className="text-center space-y-4">
            <div className="w-20 h-20 bg-emerald-800 rounded-3xl flex items-center justify-center mx-auto shadow-xl shadow-emerald-200">
              <Lock className="w-10 h-10 text-emerald-100" />
            </div>
            <h2 className="text-3xl font-heading font-bold text-slate-900">Admin Access</h2>
            <p className="text-slate-500 font-medium text-sm">Authorized personnel only. Data encrypted.</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input type="email" placeholder="Admin Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-medium" />
            </div>
            <div className="relative group">
              <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input type="password" placeholder="Security Key" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-medium" />
            </div>
            {error && <p className="text-xs font-black text-rose-600 uppercase tracking-widest text-center">{error}</p>}
            <button className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold shadow-xl hover:bg-black transition-all flex items-center justify-center gap-3">
              Verify Identity <ShieldCheck className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20 max-w-7xl mx-auto">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl lg:text-4xl font-heading font-bold text-slate-900 mb-1">Command Center</h2>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
            <p className="text-emerald-700 font-black uppercase text-[10px] tracking-[0.3em]">Authorized Session: Active</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={() => openForm()} className="bg-emerald-800 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg hover:bg-emerald-700 transition-all">
            <Plus className="w-5 h-5" /> Add New {activeTab.toUpperCase()}
          </button>
          <button onClick={() => setIsLoggedIn(false)} className="bg-white text-slate-500 border border-slate-200 px-6 py-3 rounded-2xl font-bold hover:bg-rose-50 hover:text-rose-600 transition-all">
            Logout
          </button>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
        {[
          { id: 'knowledge', label: 'Knowledge Hub', icon: BookOpen },
          { id: 'weather', label: 'Weather Districts', icon: CloudSun },
          { id: 'mandi', label: 'Market Mandis', icon: Store },
          { id: 'ca', label: 'CA Storages', icon: Warehouse }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as AdminTab)}
            className={`flex items-center gap-3 px-6 py-4 rounded-2xl font-bold transition-all border whitespace-nowrap ${activeTab === tab.id ? 'bg-emerald-900 text-white border-emerald-900 shadow-xl' : 'bg-white text-slate-500 border-slate-100 hover:bg-slate-50'}`}
          >
            <tab.icon className="w-5 h-5" /> {tab.label}
          </button>
        ))}
      </div>

      {/* Main Table View */}
      <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden min-h-[500px]">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
              <tr>
                <th className="px-8 py-5">Item Name / Title</th>
                <th className="px-8 py-5">Secondary Info</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {/* Render dynamic list based on tab */}
              {activeTab === 'knowledge' && knowledge.map((item, i) => (
                <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-6 font-bold text-slate-900">{item.title}</td>
                  <td className="px-8 py-6 text-sm text-slate-500">{item.category}</td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => openForm(item)} className="p-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all"><Edit className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(item.id, knowledge, setKnowledge, 'fck_knowledge')} className="p-2 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-600 hover:text-white transition-all"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {activeTab === 'weather' && districts.map((item, i) => (
                <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-6 font-bold text-slate-900">{item}</td>
                  <td className="px-8 py-6 text-sm text-slate-500">Kashmir Division</td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => openForm(item)} className="p-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all"><Edit className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(item, districts, setDistricts, 'fck_districts')} className="p-2 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-600 hover:text-white transition-all"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {activeTab === 'mandi' && mandis.map((item, i) => (
                <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-6 font-bold text-slate-900">{item.name}</td>
                  <td className="px-8 py-6 text-sm text-slate-500">{item.region}</td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => openForm(item)} className="p-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all"><Edit className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(item.id, mandis, setMandis, 'fck_mandis')} className="p-2 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-600 hover:text-white transition-all"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {activeTab === 'ca' && caStorages.map((item, i) => (
                <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-6 font-bold text-slate-900">{item.name}</td>
                  <td className="px-8 py-6 text-sm text-slate-500">{item.location} - {item.capacity}</td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => openForm(item)} className="p-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all"><Edit className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(item.id, caStorages, setCaStorages, 'fck_ca')} className="p-2 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-600 hover:text-white transition-all"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {(activeTab === 'knowledge' ? knowledge : activeTab === 'weather' ? districts : activeTab === 'mandi' ? mandis : caStorages).length === 0 && (
                <tr>
                  <td colSpan={3} className="px-8 py-20 text-center text-slate-400 font-medium">No items found in this category. Click "Add New" to begin.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CRUD Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setIsModalOpen(false)} />
          <form onSubmit={handleFormSubmit} className="relative bg-white w-full max-w-lg rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="bg-slate-900 p-8 text-white flex justify-between items-center">
              <h3 className="text-2xl font-bold">{editingItem ? 'Edit' : 'Add New'} {activeTab}</h3>
              <button type="button" onClick={() => setIsModalOpen(false)} className="p-2 bg-white/10 rounded-full hover:bg-white/20"><X className="w-6 h-6" /></button>
            </div>
            <div className="p-8 space-y-4">
              {activeTab === 'knowledge' && (
                <>
                  <input name="title" defaultValue={editingItem?.title} placeholder="Title" required className="w-full bg-slate-50 border p-4 rounded-2xl outline-none focus:ring-4 focus:ring-emerald-500/10" />
                  <input name="category" defaultValue={editingItem?.category} placeholder="Category (varieties/pests/etc)" required className="w-full bg-slate-50 border p-4 rounded-2xl outline-none focus:ring-4 focus:ring-emerald-500/10" />
                  <textarea name="desc" defaultValue={editingItem?.desc} placeholder="Description" required className="w-full bg-slate-50 border p-4 rounded-2xl outline-none h-32 focus:ring-4 focus:ring-emerald-500/10" />
                  <input name="tags" defaultValue={editingItem?.tags?.join(',')} placeholder="Tags (comma separated)" className="w-full bg-slate-50 border p-4 rounded-2xl outline-none" />
                </>
              )}
              {activeTab === 'weather' && (
                <input name="name" defaultValue={editingItem} placeholder="District Name" required className="w-full bg-slate-50 border p-4 rounded-2xl outline-none focus:ring-4 focus:ring-emerald-500/10" />
              )}
              {activeTab === 'mandi' && (
                <>
                  <input name="name" defaultValue={editingItem?.name} placeholder="Mandi Name" required className="w-full bg-slate-50 border p-4 rounded-2xl outline-none" />
                  <input name="region" defaultValue={editingItem?.region} placeholder="Region" required className="w-full bg-slate-50 border p-4 rounded-2xl outline-none" />
                  <input name="type" defaultValue={editingItem?.type} placeholder="Type (Apple Hub/Saffron/etc)" className="w-full bg-slate-50 border p-4 rounded-2xl outline-none" />
                </>
              )}
              {activeTab === 'ca' && (
                <>
                  <input name="name" defaultValue={editingItem?.name} placeholder="CA Name" required className="w-full bg-slate-50 border p-4 rounded-2xl outline-none" />
                  <input name="location" defaultValue={editingItem?.location} placeholder="Location" required className="w-full bg-slate-50 border p-4 rounded-2xl outline-none" />
                  <input name="capacity" defaultValue={editingItem?.capacity} placeholder="Capacity (e.g. 5,000 MT)" className="w-full bg-slate-50 border p-4 rounded-2xl outline-none" />
                  <input name="phone" defaultValue={editingItem?.phone} placeholder="Phone Number" className="w-full bg-slate-50 border p-4 rounded-2xl outline-none" />
                </>
              )}
              <button type="submit" className="w-full bg-emerald-800 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 mt-6 shadow-xl hover:bg-emerald-700 transition-all">
                <Save className="w-5 h-5" /> {editingItem ? 'Save Changes' : 'Create Entry'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Floating Info */}
      <div className="bg-amber-50 p-6 rounded-[2rem] border border-amber-100 flex items-start gap-4">
        <AlertCircle className="w-6 h-6 text-amber-600 shrink-0" />
        <div className="space-y-1">
          <p className="text-sm font-bold text-amber-900">Admin Syncing Info</p>
          <p className="text-xs text-amber-800 font-medium">Changes made here are stored in your local session. In a production environment, these would sync with our centralized J&K agricultural database servers.</p>
        </div>
      </div>
    </div>
  );
};

export default Admin;

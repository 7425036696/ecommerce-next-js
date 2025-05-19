'use client';
import { useState, useEffect } from 'react';
import Form from '../components/Form';
import List from '../components/List';
import { supabase } from '../../../lib/supabase';

export default function AdminsPage() {
  const [admins, setAdmins] = useState([]);
  const [editingAdmin, setEditingAdmin] = useState(null);

  const fetchAdmins = async () => {
    const { data, error } = await supabase.from('admins').select('*');
    if (error) {
      console.error('Error fetching admins:', error.message);
      return;
    }
    if (data) {
      setAdmins(data);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  return (
    <div className="p-5 flex flex-col md:flex-row gap-5">
      <Form
        editingThing={editingAdmin}
        onSave={fetchAdmins}
        onCancel={() => setEditingAdmin(null)}
        tableName="admins"
        title="Admin"
        showEmail={true}
      />
      <List
        items={admins}
        refreshItems={fetchAdmins}
        setEditingThing={setEditingAdmin}
        tableName="admins"
        title="Admin"
        showEmail={true}
      />
    </div>
  );
}
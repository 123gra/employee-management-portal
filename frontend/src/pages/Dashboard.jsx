import { useEffect, useState } from "react";
import axios from "axios";

const PAGE_SIZE = 5;
const API_BASE = import.meta.env.VITE_API_BASE_URL;

export default function Dashboard() {
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState({ name: "", role: "", department: "" });
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  axios.defaults.headers.common["Authorization"] =
    "Bearer " + localStorage.getItem("token");

  useEffect(() => {
    axios.get(`${API_BASE}/employees`)
      .then(res => setEmployees(res.data))
      .catch(() => {
        localStorage.removeItem("token");
        window.location.href = "/login";
      });
  }, []);

  const saveEmployee = async () => {
    if (!form.name || !form.role || !form.department) return;

    if (editingId) {
      await axios.put(`${API_BASE}/employees/${editingId}`, form);
      setEmployees(employees.map(e =>
        e.id === editingId ? { ...e, ...form } : e
      ));
    } else {
      const res = await axios.post(`${API_BASE}/employees`, form);
      setEmployees([...employees, { ...form, id: res.data.id }]);
    }

    setForm({ name: "", role: "", department: "" });
    setEditingId(null);
  };

  const deleteEmployee = async (id) => {
    await axios.delete(`${API_BASE}/employees/${id}`);
    setEmployees(employees.filter(e => e.id !== id));
  };

  const filtered = employees.filter(e =>
    e.name.toLowerCase().includes(search.toLowerCase())
  );

  const paginated = filtered.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  return (
    <div className="min-h-screen bg-slate-100 p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-slate-800">
          Employee Dashboard
        </h1>
        <button
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
          onClick={() => {
            localStorage.removeItem("token");
            window.location.href = "/login";
          }}
        >
          Logout
        </button>
      </div>

      {/* Stats Card */}
      <div className="bg-white rounded-xl shadow p-6 w-64 mb-8 border-l-4 border-indigo-600">
        <p className="text-slate-500 text-sm">Total Employees</p>
        <p className="text-3xl font-bold text-slate-800">
          {employees.length}
        </p>
      </div>

      {/* Form */}
      <div className="bg-white rounded-xl shadow p-6 mb-8">
        <h2 className="text-lg font-semibold text-slate-700 mb-4">
          {editingId ? "Update Employee" : "Add Employee"}
        </h2>

        <div className="grid grid-cols-4 gap-4">
          <input
            className="border rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500"
            placeholder="Name"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
          />
          <input
            className="border rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500"
            placeholder="Role"
            value={form.role}
            onChange={e => setForm({ ...form, role: e.target.value })}
          />
          <input
            className="border rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500"
            placeholder="Department"
            value={form.department}
            onChange={e => setForm({ ...form, department: e.target.value })}
          />
          <button
            className={`text-white rounded-md font-medium ${
              editingId
                ? "bg-emerald-600 hover:bg-emerald-700"
                : "bg-indigo-600 hover:bg-indigo-700"
            }`}
            onClick={saveEmployee}
          >
            {editingId ? "Update" : "Add"}
          </button>
        </div>
      </div>

      {/* Search */}
      <input
        className="mb-4 border rounded-md px-3 py-2 w-1/3 focus:ring-2 focus:ring-indigo-500"
        placeholder="Search employee by name"
        onChange={e => {
          setSearch(e.target.value);
          setPage(1);
        }}
      />

      {/* Table */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-200 text-slate-700">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Role</th>
              <th className="p-3 text-left">Department</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map(emp => (
              <tr key={emp.id} className="border-t hover:bg-slate-50">
                <td className="p-3 text-slate-800">{emp.name}</td>
                <td className="p-3 text-slate-700">{emp.role}</td>
                <td className="p-3 text-slate-700">{emp.department}</td>
                <td className="p-3 text-center space-x-4">
                  <button
                    className="text-indigo-600 hover:underline"
                    onClick={() => {
                      setEditingId(emp.id);
                      setForm(emp);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="text-red-500 hover:underline"
                    onClick={() => deleteEmployee(emp.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-end mt-6 gap-3">
        <button
          disabled={page === 1}
          className="px-4 py-2 border rounded-md disabled:opacity-50"
          onClick={() => setPage(page - 1)}
        >
          Prev
        </button>
        <span className="self-center text-slate-600">
          {page} / {Math.ceil(filtered.length / PAGE_SIZE) || 1}
        </span>
        <button
          disabled={page === Math.ceil(filtered.length / PAGE_SIZE)}
          className="px-4 py-2 border rounded-md disabled:opacity-50"
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}

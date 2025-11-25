import React, { useState, useEffect } from 'react';
import { User, Mail, Briefcase, Trash2, Plus, Users, Terminal } from 'lucide-react';

// 🔴 CHANGE THIS for Codespaces:
// const BACKEND_URL = "http://localhost:8080"; // use this ONLY on local machine
const BACKEND_URL = "https://symmetrical-cod-j6qrvvx9qjp25xx7-8080.app.github.dev";

const App = () => {
  const [employees, setEmployees] = useState([]);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    role: 'Developer'
  });
  const [logs, setLogs] = useState([]);

  const addLog = (method, endpoint, status) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [`[${timestamp}] ${method} ${endpoint} - ${status}`, ...prev]);
  };

  // 🔹 GET all employees on load
  useEffect(() => {
    fetch(`${BACKEND_URL}/api/v1/employees`)
      .then(res => {
        addLog("GET", "/api/v1/employees", res.status);
        if (!res.ok) throw new Error("Failed to load employees");
        return res.json();
      })
      .then(data => setEmployees(data))
      .catch(err => {
        console.error("GET error:", err);
        addLog("GET", "/api/v1/employees", "ERROR");
      });
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // 🔹 POST create employee
  const handleSubmit = (e) => {
    e.preventDefault();

    fetch(`${BACKEND_URL}/api/v1/employees`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })
      .then(res => {
        addLog("POST", "/api/v1/employees", res.status);
        if (!res.ok) throw new Error("Failed to create employee");
        return res.json();
      })
      .then(newEmployee => {
        setEmployees(prev => [...prev, newEmployee]);
        setFormData({ firstName: '', lastName: '', email: '', role: 'Developer' });
      })
      .catch(err => {
        console.error("POST error:", err);
        addLog("POST", "/api/v1/employees", "ERROR");
      });
  };

  // 🔹 DELETE employee
  const handleDelete = (id) => {
    fetch(`${BACKEND_URL}/api/v1/employees/${id}`, {
      method: 'DELETE'
    })
      .then(res => {
        addLog("DELETE", `/api/v1/employees/${id}`, res.status || "NO_STATUS");
        if (!res.ok && res.status !== 204) throw new Error("Failed to delete");
        setEmployees(prev => prev.filter(emp => emp.id !== id));
      })
      .catch(err => {
        console.error("DELETE error:", err);
        addLog("DELETE", `/api/v1/employees/${id}`, "ERROR");
      });
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8 font-sans text-slate-800">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Form */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-blue-600">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-slate-800">
              <Plus className="w-5 h-5 text-blue-600" />
              Add Employee
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">First Name</label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    required
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    placeholder="e.g. Sarah"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Last Name</label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    required
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    placeholder="e.g. Connor"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    required
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    placeholder="sarah@company.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Role</label>
                <div className="relative">
                  <Briefcase className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white"
                  >
                    <option>Developer</option>
                    <option>Manager</option>
                    <option>Designer</option>
                    <option>HR</option>
                    <option>Intern</option>
                  </select>
                </div>
              </div>

              <button 
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 mt-6 shadow-md hover:shadow-lg"
              >
                <Plus className="w-4 h-4" />
                Create Employee
              </button>
            </form>
          </div>

          {/* Backend Log */}
          <div className="mt-6 bg-slate-900 rounded-xl shadow-lg p-4 text-slate-300 font-mono text-xs overflow-hidden">
            <div className="flex justify-between items-center mb-2 pb-2 border-b border-slate-700">
              <span className="flex items-center gap-2 font-bold text-green-400">
                <Terminal className="w-3 h-3" />
                Spring Boot Logs
              </span>
              <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-400">
                Server Running: 8080
              </span>
            </div>
            <div className="h-32 overflow-y-auto space-y-1 scrollbar-hide">
              {logs.length === 0 && (
                <span className="text-slate-600 italic">Waiting for requests...</span>
              )}
              {logs.map((log, i) => (
                <div key={i} className="truncate">
                  <span className="text-blue-400">{log.split(' ')[0]}</span>
                  <span className="text-yellow-200 mx-2">{log.split(' ')[1]}</span> 
                  <span className="text-white">{log.split(' ').slice(2).join(' ')}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-slate-100">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-600" />
                  Employee Directory
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  Manage your team members and roles
                </p>
              </div>
              <span className="bg-blue-100 text-blue-700 py-1 px-3 rounded-full text-xs font-bold">
                Total: {employees.length}
              </span>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Employee</th>
                    <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Role</th>
                    <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Contact</th>
                    <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {employees.map((emp) => (
                    <tr key={emp.id} className="hover:bg-slate-50/80 transition-colors group">
                      <td className="p-4">
                        <div className="font-semibold text-slate-800">
                          {emp.firstName} {emp.lastName}
                        </div>
                        <div className="text-xs text-slate-400">ID: #{1000 + emp.id}</div>
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                          ${emp.role === 'Developer' ? 'bg-indigo-100 text-indigo-800' : 
                            emp.role === 'Manager' ? 'bg-purple-100 text-purple-800' : 
                            emp.role === 'Designer' ? 'bg-pink-100 text-pink-800' :
                            'bg-slate-100 text-slate-800'}`}>
                          {emp.role}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-slate-600 font-mono">
                        {emp.email}
                      </td>
                      <td className="p-4 text-right">
                        <button 
                          onClick={() => handleDelete(emp.id)}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                          title="Remove Employee"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {employees.length === 0 && (
                    <tr>
                      <td colSpan="4" className="p-8 text-center text-slate-400">
                        No employees found. Add one to get started.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default App;

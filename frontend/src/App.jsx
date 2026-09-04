import { useState, useEffect } from 'react';
import api from './services/api';
import { PieChart, Pie, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Cell, CartesianGrid } from 'recharts';
import { 
  LayoutDashboard, Users, BookOpen, GraduationCap, Wallet, LogOut, 
  Search, Bell, ShieldAlert, ChevronDown
} from 'lucide-react';

function App() {
    const [user, setUser] = useState(null);
    const [loginData, setLoginData] = useState({ email: '', password: '' });
    const [activeTab, setActiveTab] = useState('Overview');

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) setUser(JSON.parse(storedUser));
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/auth/login', loginData);
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            setUser(res.data.user);
        } catch (error) { alert('Login failed'); }
    };

    const handleLogout = () => {
        localStorage.clear();
        setUser(null);
    };

    const sidebarMainLinks = [
        { icon: LayoutDashboard, label: 'Overview' },
        { icon: BookOpen, label: 'Academics' },
        { icon: GraduationCap, label: 'Admissions' },
    ];

    const sidebarManageLinks = [
        { icon: Users, label: 'Students' },
        { icon: Wallet, label: 'Finances' },
        { icon: ShieldAlert, label: 'Security' },
    ];

    // --- LOGIN VIEW (MongoDB Atlas Style) ---
    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#001e2b] text-gray-200">
                <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-2xl">
                    <div className="flex justify-center mb-6">
                        <div className="w-12 h-12 bg-[#00ed64] rounded-md flex items-center justify-center text-2xl font-bold text-black">S</div>
                    </div>
                    <h1 className="text-xl font-semibold text-center text-gray-800 mb-6">Log in to SMS Platform</h1>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <label className="block text-sm text-gray-600 mb-1">Email</label>
                            <input type="email" placeholder="admin@sms.com" value={loginData.email} onChange={(e) => setLoginData({...loginData, email: e.target.value})} className="w-full p-2.5 border border-gray-300 rounded text-gray-800 focus:ring-2 focus:ring-green-500 outline-none transition" required />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-600 mb-1">Password</label>
                            <input type="password" placeholder="Password" value={loginData.password} onChange={(e) => setLoginData({...loginData, password: e.target.value})} className="w-full p-2.5 border border-gray-300 rounded text-gray-800 focus:ring-2 focus:ring-green-500 outline-none transition" required />
                        </div>
                        <button type="submit" className="w-full bg-[#001e2b] hover:bg-black text-white p-2.5 rounded font-semibold transition-colors">
                            Log In
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    // --- MONGODB ATLAS STYLE DASHBOARD ---
    return (
        <div className="h-screen flex flex-col bg-[#f7f7f7] text-gray-800">
            
            {/* Top Global Navbar */}
            <header className="h-12 bg-white border-b border-gray-200 flex items-center justify-between px-4">
                <div className="flex items-center gap-2 text-gray-700 font-medium">
                    <span>School SMS</span>
                    <ChevronDown size={14} className="text-gray-400" />
                </div>
                <div className="flex items-center gap-4">
                    <button className="text-gray-500 hover:text-gray-800 relative">
                        <Bell size={18} />
                        <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
                    </button>
                    <div className="w-7 h-7 bg-gray-200 rounded-full flex items-center justify-center text-xs font-bold text-gray-600">
                        {user.name.charAt(0)}
                    </div>
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden">
                {/* Left Sidebar */}
                <aside className="w-56 bg-white border-r border-gray-200 flex flex-col text-sm">
                    <div className="p-3 border-b border-gray-100">
                        <p className="text-xs text-gray-400 uppercase font-semibold mb-2 px-2">Deployment</p>
                        <nav className="space-y-1">
                            {sidebarMainLinks.map((link, index) => (
                                <button key={index} onClick={() => setActiveTab(link.label)} className={`w-full flex items-center gap-2.5 px-2 py-1.5 rounded transition-colors ${
                                    activeTab === link.label ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50'
                                }`}>
                                    <link.icon size={15} />
                                    {link.label}
                                </button>
                            ))}
                        </nav>
                    </div>
                    
                    <div className="p-3 flex-1">
                        <p className="text-xs text-gray-400 uppercase font-semibold mb-2 px-2">Manage</p>
                        <nav className="space-y-1">
                            {sidebarManageLinks.map((link, index) => (
                                <button key={index} onClick={() => setActiveTab(link.label)} className={`w-full flex items-center gap-2.5 px-2 py-1.5 rounded transition-colors ${
                                    activeTab === link.label ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50'
                                }`}>
                                    <link.icon size={15} />
                                    {link.label}
                                </button>
                            ))}
                        </nav>
                    </div>

                    <div className="p-3 border-t border-gray-100">
                         <button onClick={handleLogout} className="w-full flex items-center gap-2 px-2 py-1.5 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded">
                            <LogOut size={15} /> Sign out
                        </button>
                    </div>
                </aside>

                {/* Main Content Area */}
                <main className="flex-1 flex flex-col overflow-hidden">
                    {/* Warning Banner */}
                    <div className="bg-[#fdf4e3] border-b border-[#f3e0a8] text-[#5a4500] text-xs px-6 py-2 flex items-center gap-2">
                        <ShieldAlert size={14} />
                        <span>You have 1 unpaid invoice. Students with unpaid fees cannot view their grades.</span>
                    </div>

                    {/* Dashboard Header / Search Bar */}
                    <div className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                        <div>
                            <h1 className="text-xl font-semibold text-gray-800">{activeTab}</h1>
                            <p className="text-xs text-gray-500 mt-0.5">View and manage your school's real-time data.</p>
                        </div>
                        <div className="relative w-64">
                            <Search size={14} className="absolute left-3 top-3 text-gray-400" />
                            <input 
                                placeholder={`Search ${activeTab}...`} 
                                className="w-full pl-8 pr-3 py-2 bg-gray-50 border border-gray-200 rounded text-sm outline-none focus:border-green-500 focus:bg-white transition" 
                            />
                        </div>
                    </div>

                    {/* Dynamic Content Renderer */}
                    <div className="flex-1 overflow-y-auto p-6 bg-[#f7f7f7]">
                        {activeTab === 'Overview' && <OverviewView />}
                        {activeTab === 'Academics' && <CoursesView />}
                        {activeTab === 'Admissions' && <StudentsView />}
                        {activeTab === 'Students' && <StudentsView />}
                        {activeTab === 'Finances' && <FinancesView />}
                        {activeTab === 'Security' && <SecurityView />}
                    </div>
                </main>
            </div>
        </div>
    );
}

// --- SUBCOMPONENTS ---

const OverviewView = () => {
    const [stats, setStats] = useState(null);

    useEffect(() => {
        api.get('/fees/stats').then(res => setStats(res.data)).catch(err => console.error(err));
    }, []);

    const chartData = stats ? [
        { name: 'Collected', value: stats.paid, fill: '#00ed64' },
        { name: 'Arrears', value: stats.unpaid, fill: '#ff4d4f' }
    ] : [];

    return (
        <div className="space-y-6">
            {/* Stat Cards Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-sm text-gray-500 font-medium">Total Students</p>
                        <Users size={18} className="text-gray-400" />
                    </div>
                    <p className="text-3xl font-bold text-gray-800">{stats ? stats.paidCount + stats.unpaidCount : 0}</p>
                    <p className="text-xs text-gray-400 mt-1">Active enrollments</p>
                </div>
                
                <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-sm text-gray-500 font-medium">Collected (GHS)</p>
                        <Wallet size={18} className="text-green-500" />
                    </div>
                    <p className="text-3xl font-bold text-green-600">{stats ? stats.paid : 0}</p>
                    <p className="text-xs text-gray-400 mt-1">Paid invoices</p>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-sm text-gray-500 font-medium">Arrears (GHS)</p>
                        <ShieldAlert size={18} className="text-red-500" />
                    </div>
                    <p className="text-3xl font-bold text-red-600">{stats ? stats.unpaid : 0}</p>
                    <p className="text-xs text-gray-400 mt-1">Outstanding balances</p>
                </div>
            </div>

            {/* Chart Container */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                    <h2 className="text-base font-medium text-gray-800">Fee Distribution</h2>
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                        <span>Last 30 days</span>
                        <ChevronDown size={14} />
                    </div>
                </div>
                <div className="p-4 h-72">
                    {stats ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                                <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} />
                                <YAxis stroke="#9ca3af" fontSize={12} />
                                <Tooltip 
                                    contentStyle={{ 
                                        backgroundColor: '#ffffff', 
                                        border: '1px solid #e5e7eb', 
                                        borderRadius: '4px', 
                                        boxShadow: '0 2px 4px rgba(0,0,0,0.05)' 
                                    }} 
                                    cursor={{ fill: '#f9fafb' }}
                                />
                                <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={60}>
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.fill} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="h-full flex items-center justify-center text-gray-400 text-sm">Loading chart data...</div>
                    )}
                </div>
            </div>
        </div>
    );
};

const SecurityView = () => (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <h2 className="text-lg font-medium text-gray-800 mb-2">Security & Access</h2>
        <p className="text-sm text-gray-500 mb-6">Manage user roles, passwords, and system security.</p>
        
        <div className="space-y-3">
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded bg-gray-50">
                <div className="flex items-center gap-3">
                    <ShieldAlert size={20} className="text-green-600" />
                    <div>
                        <p className="font-medium text-gray-800">Two-Factor Authentication (2FA)</p>
                        <p className="text-xs text-gray-500">Add an extra layer of security for all admin accounts.</p>
                    </div>
                </div>
                <button className="text-sm text-white bg-green-600 px-3 py-1.5 rounded hover:bg-green-700">Enable</button>
            </div>

            <div className="flex items-center justify-between p-4 border border-gray-200 rounded bg-gray-50">
                <div className="flex items-center gap-3">
                    <Users size={20} className="text-blue-600" />
                    <div>
                        <p className="font-medium text-gray-800">Role-Based Access Control (RBAC)</p>
                        <p className="text-xs text-gray-500">Manage what students, teachers, and admins can see.</p>
                    </div>
                </div>
                <button className="text-sm text-gray-600 border border-gray-300 px-3 py-1.5 rounded hover:bg-gray-100">Configure</button>
            </div>
        </div>
    </div>
);

const StudentsView = () => {
    const [students, setStudents] = useState([]);
    useEffect(() => {
        api.get('/auth/users').then(res => setStudents(res.data.filter(u => u.role === 'student'))).catch(err => console.error(err));
    }, []);

    return (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <div>
                    <h2 className="text-lg font-medium text-gray-800">Student Directory</h2>
                    <p className="text-xs text-gray-500 mt-1">{students.length} active students</p>
                </div>
                <button className="text-sm text-white bg-[#001e2b] px-3 py-1.5 rounded hover:bg-black">+ Add Student</button>
            </div>
            
            {/* Enterprise Data Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-600">
                    <thead className="bg-gray-50 text-xs text-gray-500 uppercase border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-3 font-medium">Name</th>
                            <th className="px-6 py-3 font-medium">Email</th>
                            <th className="px-6 py-3 font-medium">Student ID</th>
                            <th className="px-6 py-3 font-medium">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {students.length === 0 && (
                            <tr><td colSpan="4" className="text-center py-10 text-gray-400">No students found.</td></tr>
                        )}
                        {students.map(student => (
                            <tr key={student._id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-green-100 text-green-700 rounded-full flex items-center justify-center text-xs font-bold">{student.name.charAt(0)}</div>
                                        <span className="text-gray-800 font-medium">{student.name}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-gray-500">{student.email}</td>
                                <td className="px-6 py-4">
                                    <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs font-mono">{student.studentId || 'N/A'}</span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="inline-flex items-center gap-1.5 text-xs text-green-700 bg-green-50 px-2 py-1 rounded-full border border-green-100">
                                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span> Active
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const CoursesView = () => {
    const [courses, setCourses] = useState([]);
    useEffect(() => {
        api.get('/courses/').then(res => setCourses(res.data)).catch(err => console.error(err));
    }, []);

    return (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <div>
                    <h2 className="text-lg font-medium text-gray-800">Active Courses</h2>
                    <p className="text-xs text-gray-500 mt-1">{courses.length} courses offered this semester</p>
                </div>
                <button className="text-sm text-white bg-[#001e2b] px-3 py-1.5 rounded hover:bg-black">+ Add Course</button>
            </div>
            
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-600">
                    <thead className="bg-gray-50 text-xs text-gray-500 uppercase border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-3 font-medium">Course Title</th>
                            <th className="px-6 py-3 font-medium">Code</th>
                            <th className="px-6 py-3 font-medium">Credits</th>
                            <th className="px-6 py-3 font-medium">Instructor</th>
                            <th className="px-6 py-3 font-medium">Enrollment</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {courses.length === 0 && (
                            <tr><td colSpan="5" className="text-center py-10 text-gray-400">No courses found.</td></tr>
                        )}
                        {courses.map(course => (
                            <tr key={course._id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 text-gray-800 font-medium">{course.title}</td>
                                <td className="px-6 py-4">
                                    <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-mono">{course.code}</span>
                                </td>
                                <td className="px-6 py-4 text-gray-500">{course.credits}</td>
                                <td className="px-6 py-4 text-gray-700">{course.teacher ? course.teacher.name : 'Unassigned'}</td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <span className="text-gray-800 font-medium">{course.students.length}</span>
                                        <span className="text-xs text-gray-400">students</span>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const FinancesView = () => {
    const [stats, setStats] = useState(null);
    useEffect(() => {
        api.get('/fees/stats').then(res => setStats(res.data)).catch(err => console.error(err));
    }, []);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                <p className="text-sm text-gray-500 font-medium">Total Revenue</p>
                <p className="text-3xl font-bold text-green-600 mt-2">GHS {stats ? stats.paid : 0}</p>
                <div className="mt-4 h-2 bg-green-100 rounded-full">
                    <div className="h-2 bg-green-500 rounded-full" style={{ width: `${stats ? (stats.paid / (stats.paid + stats.unpaid)) * 100 : 0}%` }}></div>
                </div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                <p className="text-sm text-gray-500 font-medium">Outstanding Arrears</p>
                <p className="text-3xl font-bold text-red-600 mt-2">GHS {stats ? stats.unpaid : 0}</p>
                <div className="mt-4 h-2 bg-red-100 rounded-full">
                    <div className="h-2 bg-red-500 rounded-full" style={{ width: `${stats ? (stats.unpaid / (stats.paid + stats.unpaid)) * 100 : 0}%` }}></div>
                </div>
            </div>
        </div>
    );
};

export default App;
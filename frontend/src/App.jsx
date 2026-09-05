import { useState, useEffect } from 'react';
import api from './services/api';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Cell, CartesianGrid, Tooltip } from 'recharts';
import {
  LayoutDashboard, Users, BookOpen, GraduationCap, Wallet, LogOut,
  Search, Bell, ShieldAlert, ChevronDown, X, DollarSign, AlertTriangle
} from 'lucide-react';

// -- Palette (kept as Tailwind arbitrary values so no config changes are needed) --
// ink      #1F2937   primary text
// paper    #FAFAF7   page background
// slate    #3B5BA5   the one accent - primary actions, links, focus
// brass    #A9822B   sparing highlight - badges, standout numbers
// sage     #4C7A5A   success / on-track
// amber    #C97A2B   attention / needs review
// graphite #6B6B65   structural text, hairlines

function App() {
    const [user, setUser] = useState(null);
    const [loginData, setLoginData] = useState({ email: '', password: '' });
    const [activeTab, setActiveTab] = useState('Overview');
    const [quickStats, setQuickStats] = useState({ students: null, courses: null, arrears: null });

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) setUser(JSON.parse(storedUser));
    }, []);

    // Lightweight counts for the sidebar info pills - reuses the same endpoints
    // the individual views already call, so no new backend routes are needed.
    useEffect(() => {
        if (!user) return;
        api.get('/fees/stats').then(res => {
            setQuickStats(prev => ({ ...prev, students: res.data.paidCount + res.data.unpaidCount, arrears: res.data.unpaid }));
        }).catch(() => {});
        api.get('/courses/').then(res => {
            setQuickStats(prev => ({ ...prev, courses: res.data.length }));
        }).catch(() => {});
    }, [user]);

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

    // Each item pairs an icon with a gradient (active state) and tint (resting state)
    // built from the same slate / sage / brass / amber tokens used elsewhere, so the
    // gradients read as "this app's palette, saturated" rather than generic rainbow icons.
    const sidebarMainLinks = [
        { icon: LayoutDashboard, label: 'Overview', color: '#3B5BA5', gradient: 'from-[#3B5BA5] to-[#7396CE]', tint: 'from-[#EAF0FA] to-[#DAE6F7]' },
        { icon: BookOpen, label: 'Academics', color: '#4C7A5A', gradient: 'from-[#4C7A5A] to-[#7EA88C]', tint: 'from-[#EAF3EE] to-[#D9EBE0]', stat: quickStats.courses !== null ? `${quickStats.courses}` : null },
        { icon: GraduationCap, label: 'Admissions', color: '#A9822B', gradient: 'from-[#A9822B] to-[#CFAC5C]', tint: 'from-[#F7EFDD] to-[#F0E2C3]' },
    ];

    const sidebarManageLinks = [
        { icon: Users, label: 'Students', color: '#3B5BA5', gradient: 'from-[#3B5BA5] to-[#7396CE]', tint: 'from-[#EAF0FA] to-[#DAE6F7]', stat: quickStats.students !== null ? `${quickStats.students}` : null },
        { icon: Wallet, label: 'Finances', color: '#4C7A5A', gradient: 'from-[#4C7A5A] to-[#7EA88C]', tint: 'from-[#EAF3EE] to-[#D9EBE0]', stat: quickStats.arrears !== null ? `GHS ${quickStats.arrears.toLocaleString()}` : null },
        { icon: ShieldAlert, label: 'Security', color: '#C97A2B', gradient: 'from-[#C97A2B] to-[#E0A661]', tint: 'from-[#FBF1E3] to-[#F5E4C6]' },
    ];

    const today = new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

    // --- LOGIN VIEW ---
    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#FAFAF7] text-[#1F2937]">
                <div className="w-full max-w-md p-8 bg-white border border-[#E5E3DA]">
                    <div className="flex justify-center mb-6">
                        <div className="w-12 h-12 bg-[#3B5BA5] flex items-center justify-center text-2xl font-serif text-white">S</div>
                    </div>
                    <h1 className="text-xl font-serif text-center text-[#1F2937] mb-1">Sign in to the register</h1>
                    <p className="text-xs text-center text-[#6B6B65] mb-6">School management &amp; administration</p>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <label className="block text-sm text-[#6B6B65] mb-1">Email</label>
                            <input type="email" placeholder="admin@school.edu" value={loginData.email} onChange={(e) => setLoginData({...loginData, email: e.target.value})} className="w-full p-2.5 border border-[#D8D6CC] text-[#1F2937] focus:ring-2 focus:ring-[#3B5BA5] focus:border-[#3B5BA5] outline-none transition" required />
                        </div>
                        <div>
                            <label className="block text-sm text-[#6B6B65] mb-1">Password</label>
                            <input type="password" placeholder="Password" value={loginData.password} onChange={(e) => setLoginData({...loginData, password: e.target.value})} className="w-full p-2.5 border border-[#D8D6CC] text-[#1F2937] focus:ring-2 focus:ring-[#3B5BA5] focus:border-[#3B5BA5] outline-none transition" required />
                        </div>
                        <button type="submit" className="w-full bg-[#1F2937] hover:bg-black text-white p-2.5 font-medium transition-colors">
                            Sign in
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    // --- MAIN DASHBOARD ---
    return (
        <div className="h-screen flex flex-col bg-[#FAFAF7] text-[#1F2937]">

            {/* Term strip replaces the generic top bar */}
            <header className="h-14 bg-white border-b border-[#E5E3DA] flex items-center justify-between px-6 z-10">
                <div className="flex items-center gap-3">
                    <span className="font-serif text-base">Riverside School</span>
                    <span className="text-[#D8D6CC]">|</span>
                    <span className="text-sm text-[#6B6B65]">Term 2 &middot; Week 6 &middot; {today}</span>
                </div>
                <div className="flex items-center gap-4">
                    <button className="text-[#6B6B65] hover:text-[#1F2937] relative">
                        <Bell size={18} />
                        <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-[#C97A2B] rounded-full"></span>
                    </button>
                    <div className="w-7 h-7 border border-[#D8D6CC] flex items-center justify-center text-xs font-medium text-[#6B6B65]">
                        {user.name.charAt(0)}
                    </div>
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden">
                <aside className="w-64 bg-white border-r border-[#E5E3DA] flex flex-col text-sm">
                    <div className="p-3 border-b border-[#F0EEE6]">
                        <p className="text-xs text-[#6B6B65] uppercase tracking-wide font-medium mb-2 px-2">Overview</p>
                        <nav className="space-y-1">
                            {sidebarMainLinks.map((link, index) => {
                                const isActive = activeTab === link.label;
                                return (
                                    <button key={index} onClick={() => setActiveTab(link.label)} className={`w-full flex items-center gap-3 px-2 py-2 transition-colors ${isActive ? 'bg-[#FAFAF7]' : 'hover:bg-[#FAFAF7]'}`}>
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-gradient-to-br ${isActive ? link.gradient : link.tint}`}>
                                            <link.icon size={15} className={isActive ? 'text-white' : ''} style={isActive ? {} : { color: link.color }} />
                                        </div>
                                        <span className={`flex-1 text-left ${isActive ? 'text-[#1F2937] font-medium' : 'text-[#4B4B47]'}`}>{link.label}</span>
                                        {link.stat && (
                                            <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full" style={{ backgroundColor: `${link.color}1A`, color: link.color }}>{link.stat}</span>
                                        )}
                                    </button>
                                );
                            })}
                        </nav>
                    </div>

                    <div className="p-3 flex-1">
                        <p className="text-xs text-[#6B6B65] uppercase tracking-wide font-medium mb-2 px-2">Manage</p>
                        <nav className="space-y-1">
                            {sidebarManageLinks.map((link, index) => {
                                const isActive = activeTab === link.label;
                                return (
                                    <button key={index} onClick={() => setActiveTab(link.label)} className={`w-full flex items-center gap-3 px-2 py-2 transition-colors ${isActive ? 'bg-[#FAFAF7]' : 'hover:bg-[#FAFAF7]'}`}>
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-gradient-to-br ${isActive ? link.gradient : link.tint}`}>
                                            <link.icon size={15} className={isActive ? 'text-white' : ''} style={isActive ? {} : { color: link.color }} />
                                        </div>
                                        <span className={`flex-1 text-left ${isActive ? 'text-[#1F2937] font-medium' : 'text-[#4B4B47]'}`}>{link.label}</span>
                                        {link.stat && (
                                            <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full" style={{ backgroundColor: `${link.color}1A`, color: link.color }}>{link.stat}</span>
                                        )}
                                    </button>
                                );
                            })}
                        </nav>
                    </div>

                    <div className="p-3 border-t border-[#F0EEE6]">
                         <button onClick={handleLogout} className="w-full flex items-center gap-2 px-2 py-1.5 text-[#6B6B65] hover:text-[#C97A2B] transition-colors">
                            <LogOut size={15} /> Sign out
                        </button>
                    </div>
                </aside>

                <main className="flex-1 flex flex-col overflow-hidden">
                    <div className="bg-[#FBF1E3] border-b border-[#EAD8B4] text-[#7A5810] text-xs px-6 py-2 flex items-center gap-2">
                        <AlertTriangle size={14} />
                        <span>1 unpaid invoice. Students with unpaid fees cannot view their grades.</span>
                    </div>

                    <div className="bg-white border-b border-[#E5E3DA] px-6 py-4 flex justify-between items-center">
                        <div>
                            <h1 className="text-xl font-serif text-[#1F2937]">{activeTab}</h1>
                            <p className="text-xs text-[#6B6B65] mt-0.5">View and manage your school's real-time data.</p>
                        </div>
                        <div className="relative w-64">
                            <Search size={14} className="absolute left-3 top-3 text-[#9C9A90]" />
                            <input placeholder={`Search ${activeTab}...`} className="w-full pl-8 pr-3 py-2 bg-[#FAFAF7] border border-[#E5E3DA] text-sm outline-none focus:border-[#3B5BA5] focus:bg-white transition" />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 bg-[#FAFAF7]">
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
        { name: 'Collected', value: stats.paid, fill: '#4C7A5A' },
        { name: 'Arrears', value: stats.unpaid, fill: '#C97A2B' }
    ] : [];

    const recentActivity = [
        { id: 1, name: 'Isaac', action: 'paid fees', amount: 'GHS 5,000', time: '2m ago', icon: <DollarSign size={16} />, tone: 'text-[#4C7A5A] bg-[#EAF3EE]' },
        { id: 2, name: 'Dr. Mensah', action: 'updated DCIT 201 grades', amount: '', time: '15m ago', icon: <GraduationCap size={16} />, tone: 'text-[#3B5BA5] bg-[#EAF0FA]' },
        { id: 3, name: 'Ama', action: 'enrolled in Operating Systems', amount: '', time: '1h ago', icon: <BookOpen size={16} />, tone: 'text-[#A9822B] bg-[#F7EFDD]' },
    ];

    return (
        <div className="space-y-6">
            {/* Metric cards - flat, hairline top accent instead of rounded soft-shadow cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="bg-white border border-[#E5E3DA] p-6 border-t-2 border-t-[#3B5BA5]">
                    <div className="flex items-center justify-between mb-4">
                        <Users size={20} className="text-[#3B5BA5]" />
                        <span className="text-xs font-medium text-[#4C7A5A]">+12% this month</span>
                    </div>
                    <p className="text-sm text-[#6B6B65]">Total students</p>
                    <p className="text-3xl font-serif text-[#1F2937] mt-1">{stats ? stats.paidCount + stats.unpaidCount : 0}</p>
                </div>

                <div className="bg-white border border-[#E5E3DA] p-6 border-t-2 border-t-[#4C7A5A]">
                    <div className="flex items-center justify-between mb-4">
                        <DollarSign size={20} className="text-[#4C7A5A]" />
                        <span className="text-xs font-medium text-[#6B6B65]">GHS</span>
                    </div>
                    <p className="text-sm text-[#6B6B65]">Total revenue</p>
                    <p className="text-3xl font-serif text-[#1F2937] mt-1">{stats ? stats.paid.toLocaleString() : 0}</p>
                </div>

                <div className="bg-white border border-[#E5E3DA] p-6 border-t-2 border-t-[#C97A2B]">
                    <div className="flex items-center justify-between mb-4">
                        <AlertTriangle size={20} className="text-[#C97A2B]" />
                        <span className="text-xs font-medium text-[#C97A2B]">Needs review</span>
                    </div>
                    <p className="text-sm text-[#6B6B65]">Outstanding arrears</p>
                    <p className="text-3xl font-serif text-[#1F2937] mt-1">{stats ? stats.unpaid.toLocaleString() : 0}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white border border-[#E5E3DA]">
                    <div className="p-5 border-b border-[#F0EEE6] flex justify-between items-center">
                        <div>
                            <h2 className="text-base font-serif text-[#1F2937]">Fee distribution</h2>
                            <p className="text-xs text-[#6B6B65] mt-0.5">Revenue collected vs. outstanding balances</p>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-[#9C9A90] cursor-pointer hover:text-[#6B6B65]">
                            <span>Last 30 days</span>
                            <ChevronDown size={14} />
                        </div>
                    </div>
                    <div className="p-5 h-80">
                        {stats ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#F0EEE6" vertical={false} />
                                    <XAxis dataKey="name" stroke="#9C9A90" fontSize={12} axisLine={false} tickLine={false} />
                                    <YAxis stroke="#9C9A90" fontSize={12} axisLine={false} tickLine={false} />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: '#ffffff',
                                            border: '1px solid #E5E3DA',
                                            borderRadius: '2px',
                                            boxShadow: 'none'
                                        }}
                                        cursor={{ fill: '#FAFAF7' }}
                                    />
                                    <Bar dataKey="value" radius={[2, 2, 0, 0]} barSize={80}>
                                        {chartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.fill} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex items-center justify-center text-[#9C9A90] text-sm">Loading chart data...</div>
                        )}
                    </div>
                </div>

                <div className="bg-white border border-[#E5E3DA] flex flex-col">
                    <div className="p-5 border-b border-[#F0EEE6] flex justify-between items-center">
                        <div>
                            <h2 className="text-base font-serif text-[#1F2937]">Recent activity</h2>
                            <p className="text-xs text-[#6B6B65] mt-0.5">Latest updates from the school</p>
                        </div>
                        <Bell size={16} className="text-[#9C9A90]" />
                    </div>
                    <div className="p-5 space-y-5 flex-1">
                        {recentActivity.map(activity => (
                            <div key={activity.id} className="flex items-start gap-3">
                                <div className={`w-9 h-9 flex items-center justify-center ${activity.tone}`}>
                                    {activity.icon}
                                </div>
                                <div className="flex-1 pt-0.5">
                                    <p className="text-sm text-[#1F2937]">
                                        <span className="font-medium">{activity.name}</span> {activity.action}
                                        {activity.amount && <span className="font-medium text-[#4C7A5A]"> {activity.amount}</span>}
                                    </p>
                                    <p className="text-xs text-[#9C9A90] mt-1">{activity.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="text-sm text-[#3B5BA5] hover:text-[#2A4380] font-medium p-4 border-t border-[#F0EEE6] w-full text-left">
                        View all activity
                    </button>
                </div>
            </div>
        </div>
    );
};

const SecurityView = () => (
    <div className="bg-white border border-[#E5E3DA] p-6">
        <h2 className="text-lg font-serif text-[#1F2937] mb-2">Security &amp; access</h2>
        <p className="text-sm text-[#6B6B65] mb-6">Manage user roles, passwords, and system security.</p>
        <div className="space-y-3">
            <div className="flex items-center justify-between p-4 border border-[#E5E3DA] bg-[#FAFAF7]">
                <div className="flex items-center gap-3">
                    <ShieldAlert size={20} className="text-[#4C7A5A]" />
                    <div>
                        <p className="font-medium text-[#1F2937]">Two-factor authentication</p>
                        <p className="text-xs text-[#6B6B65]">Add an extra layer of security for all admin accounts.</p>
                    </div>
                </div>
                <button className="text-sm text-white bg-[#3B5BA5] px-3 py-1.5 hover:bg-[#2A4380]">Enable</button>
            </div>
            <div className="flex items-center justify-between p-4 border border-[#E5E3DA] bg-[#FAFAF7]">
                <div className="flex items-center gap-3">
                    <Users size={20} className="text-[#3B5BA5]" />
                    <div>
                        <p className="font-medium text-[#1F2937]">Role-based access control</p>
                        <p className="text-xs text-[#6B6B65]">Manage what students, teachers, and admins can see.</p>
                    </div>
                </div>
                <button className="text-sm text-[#6B6B65] border border-[#D8D6CC] px-3 py-1.5 hover:bg-white">Configure</button>
            </div>
        </div>
    </div>
);

const StudentsView = () => {
    const [students, setStudents] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newStudent, setNewStudent] = useState({ name: '', email: '', password: 'pass123', studentId: '' });

    const loadStudents = async () => {
        try {
            const res = await api.get('/auth/users');
            setStudents(res.data.filter(u => u.role === 'student'));
        } catch (error) {
            console.error("FAILED TO LOAD STUDENTS:", error.response?.data?.error || error.message);
        }
    };

    useEffect(() => {
        loadStudents();
    }, []);

    const handleAddStudent = async (e) => {
        e.preventDefault();
        try {
            await api.post('/auth/register', { ...newStudent, role: 'student' });
            setIsModalOpen(false);
            setNewStudent({ name: '', email: '', password: 'pass123', studentId: '' });
            loadStudents();
        } catch (error) {
            alert('Failed to add student. Email might already exist.');
        }
    };

    return (
        <div className="bg-white border border-[#E5E3DA] relative">
            <div className="p-4 border-b border-[#E5E3DA] flex justify-between items-center">
                <div>
                    <h2 className="text-lg font-serif text-[#1F2937]">Student register</h2>
                    <p className="text-xs text-[#6B6B65] mt-1">{students.length} active students</p>
                </div>
                <button onClick={() => setIsModalOpen(true)} className="text-sm text-white bg-[#1F2937] px-3 py-1.5 hover:bg-black">
                    Add student
                </button>
            </div>

            <table className="w-full text-sm text-left text-[#4B4B47]">
                <thead className="text-xs text-[#6B6B65] uppercase tracking-wide border-b border-[#E5E3DA]">
                    <tr>
                        <th className="px-6 py-3 font-medium">Name</th>
                        <th className="px-6 py-3 font-medium">Email</th>
                        <th className="px-6 py-3 font-medium">Student ID</th>
                        <th className="px-6 py-3 font-medium">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {students.length === 0 && (
                        <tr><td colSpan="4" className="text-center py-10 text-[#9C9A90]">No students found.</td></tr>
                    )}
                    {students.map(student => (
                        <tr key={student._id} className="border-b border-[#F0EEE6] hover:bg-[#FAFAF7] transition-colors">
                            <td className="px-6 py-4 text-[#1F2937] font-medium">{student.name}</td>
                            <td className="px-6 py-4 text-[#6B6B65]">{student.email}</td>
                            <td className="px-6 py-4">
                                <span className="px-2 py-1 bg-[#F0EEE6] text-[#4B4B47] text-xs font-mono">{student.studentId || 'N/A'}</span>
                            </td>
                            <td className="px-6 py-4">
                                <span className="inline-flex items-center gap-1.5 text-xs text-[#4C7A5A]">
                                    <span className="w-1.5 h-1.5 bg-[#4C7A5A] rounded-full"></span> Active
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white w-full max-w-md p-6 relative">
                        <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-[#9C9A90] hover:text-[#1F2937]">
                            <X size={18} />
                        </button>
                        <h3 className="text-lg font-serif text-[#1F2937] mb-4">Add new student</h3>
                        <form onSubmit={handleAddStudent} className="space-y-3">
                            <input type="text" placeholder="Full name" value={newStudent.name} onChange={(e) => setNewStudent({...newStudent, name: e.target.value})} className="w-full p-2 border border-[#D8D6CC] text-sm focus:border-[#3B5BA5] outline-none" required />
                            <input type="email" placeholder="Email address" value={newStudent.email} onChange={(e) => setNewStudent({...newStudent, email: e.target.value})} className="w-full p-2 border border-[#D8D6CC] text-sm focus:border-[#3B5BA5] outline-none" required />
                            <input type="text" placeholder="Student ID (e.g., UCC1234)" value={newStudent.studentId} onChange={(e) => setNewStudent({...newStudent, studentId: e.target.value})} className="w-full p-2 border border-[#D8D6CC] text-sm focus:border-[#3B5BA5] outline-none" required />
                            <div className="flex justify-end gap-2 pt-4">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="text-sm text-[#6B6B65] border border-[#D8D6CC] px-3 py-1.5 hover:bg-[#FAFAF7]">Cancel</button>
                                <button type="submit" className="text-sm text-white bg-[#3B5BA5] px-3 py-1.5 hover:bg-[#2A4380]">Save student</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

const CoursesView = () => {
    const [courses, setCourses] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newCourse, setNewCourse] = useState({ title: '', code: '', credits: 3 });

    const loadCourses = async () => {
        try {
            const res = await api.get('/courses/');
            setCourses(res.data);
        } catch (error) { console.error(error); }
    };

    useEffect(() => {
        loadCourses();
    }, []);

    const handleAddCourse = async (e) => {
        e.preventDefault();
        try {
            await api.post('/courses/', newCourse);
            setIsModalOpen(false);
            setNewCourse({ title: '', code: '', credits: 3 });
            loadCourses();
        } catch (error) {
            alert('Failed to add course.');
        }
    };

    return (
        <div className="bg-white border border-[#E5E3DA] relative">
            <div className="p-4 border-b border-[#E5E3DA] flex justify-between items-center">
                <div>
                    <h2 className="text-lg font-serif text-[#1F2937]">Active courses</h2>
                    <p className="text-xs text-[#6B6B65] mt-1">{courses.length} courses offered this semester</p>
                </div>
                <button onClick={() => setIsModalOpen(true)} className="text-sm text-white bg-[#1F2937] px-3 py-1.5 hover:bg-black">
                    Add course
                </button>
            </div>

            <table className="w-full text-sm text-left text-[#4B4B47]">
                <thead className="text-xs text-[#6B6B65] uppercase tracking-wide border-b border-[#E5E3DA]">
                    <tr>
                        <th className="px-6 py-3 font-medium">Course title</th>
                        <th className="px-6 py-3 font-medium">Code</th>
                        <th className="px-6 py-3 font-medium">Credits</th>
                        <th className="px-6 py-3 font-medium">Instructor</th>
                        <th className="px-6 py-3 font-medium">Enrollment</th>
                    </tr>
                </thead>
                <tbody>
                    {courses.length === 0 && (
                        <tr><td colSpan="5" className="text-center py-10 text-[#9C9A90]">No courses found.</td></tr>
                    )}
                    {courses.map(course => (
                        <tr key={course._id} className="border-b border-[#F0EEE6] hover:bg-[#FAFAF7] transition-colors">
                            <td className="px-6 py-4 text-[#1F2937] font-medium">{course.title}</td>
                            <td className="px-6 py-4">
                                <span className="px-2 py-1 bg-[#EAF0FA] text-[#3B5BA5] text-xs font-mono">{course.code}</span>
                            </td>
                            <td className="px-6 py-4 text-[#6B6B65]">{course.credits}</td>
                            <td className="px-6 py-4 text-[#4B4B47]">{course.teacher ? course.teacher.name : 'Unassigned'}</td>
                            <td className="px-6 py-4">
                                <span className="text-[#1F2937] font-medium">{course.students.length}</span>
                                <span className="text-xs text-[#9C9A90]"> students</span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white w-full max-w-md p-6 relative">
                        <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-[#9C9A90] hover:text-[#1F2937]">
                            <X size={18} />
                        </button>
                        <h3 className="text-lg font-serif text-[#1F2937] mb-4">Add new course</h3>
                        <form onSubmit={handleAddCourse} className="space-y-3">
                            <input type="text" placeholder="Course title (e.g., Calculus)" value={newCourse.title} onChange={(e) => setNewCourse({...newCourse, title: e.target.value})} className="w-full p-2 border border-[#D8D6CC] text-sm focus:border-[#3B5BA5] outline-none" required />
                            <input type="text" placeholder="Course code (e.g., MATH 101)" value={newCourse.code} onChange={(e) => setNewCourse({...newCourse, code: e.target.value})} className="w-full p-2 border border-[#D8D6CC] text-sm focus:border-[#3B5BA5] outline-none" required />
                            <input type="number" placeholder="Credits" value={newCourse.credits} onChange={(e) => setNewCourse({...newCourse, credits: parseInt(e.target.value)})} className="w-full p-2 border border-[#D8D6CC] text-sm focus:border-[#3B5BA5] outline-none" required />
                            <div className="flex justify-end gap-2 pt-4">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="text-sm text-[#6B6B65] border border-[#D8D6CC] px-3 py-1.5 hover:bg-[#FAFAF7]">Cancel</button>
                                <button type="submit" className="text-sm text-white bg-[#3B5BA5] px-3 py-1.5 hover:bg-[#2A4380]">Save course</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
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
            <div className="bg-white border border-[#E5E3DA] p-6">
                <p className="text-sm text-[#6B6B65]">Total revenue</p>
                <p className="text-3xl font-serif text-[#4C7A5A] mt-2">GHS {stats ? stats.paid : 0}</p>
                <div className="mt-4 h-1.5 bg-[#EAF3EE]">
                    <div className="h-1.5 bg-[#4C7A5A]" style={{ width: `${stats ? (stats.paid / (stats.paid + stats.unpaid)) * 100 : 0}%` }}></div>
                </div>
            </div>
            <div className="bg-white border border-[#E5E3DA] p-6">
                <p className="text-sm text-[#6B6B65]">Outstanding arrears</p>
                <p className="text-3xl font-serif text-[#C97A2B] mt-2">GHS {stats ? stats.unpaid : 0}</p>
                <div className="mt-4 h-1.5 bg-[#FBF1E3]">
                    <div className="h-1.5 bg-[#C97A2B]" style={{ width: `${stats ? (stats.unpaid / (stats.paid + stats.unpaid)) * 100 : 0}%` }}></div>
                </div>
            </div>
        </div>
    );
};

export default App;
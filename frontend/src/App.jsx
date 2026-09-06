import { useState, useEffect } from 'react';
import api from './services/api';
import { ResponsiveContainer, BarChart, Bar, LineChart, Line, AreaChart, Area, PieChart, Pie, XAxis, YAxis, Cell, CartesianGrid, Tooltip, Legend } from 'recharts';
import {
  LayoutDashboard, Users, BookOpen, GraduationCap, Wallet, LogOut,
  Search, Bell, ShieldAlert, ChevronDown, X, DollarSign, AlertTriangle, UserCheck, Calendar
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
            <div className="relative min-h-screen flex items-center justify-center bg-[#FAFAF7] text-[#1F2937] overflow-hidden">
                {/* Soft color blobs - purely decorative, give the glass card something to blur */}
                <div className="absolute -top-32 -left-20 w-96 h-96 bg-[#3B5BA5]/20 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-32 -right-20 w-96 h-96 bg-[#A9822B]/20 rounded-full blur-3xl"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-[#4C7A5A]/10 rounded-full blur-3xl"></div>

                <div className="relative w-full max-w-md p-8 bg-white/70 backdrop-blur-xl border border-white/60 shadow-xl rounded-2xl">
                    <div className="flex justify-center mb-6">
                        <div className="w-12 h-12 bg-[#3B5BA5] rounded-xl flex items-center justify-center text-2xl font-serif text-white shadow-lg shadow-[#3B5BA5]/30">S</div>
                    </div>
                    <h1 className="text-xl font-serif text-center text-[#1F2937] mb-1">Sign in to the register</h1>
                    <p className="text-xs text-center text-[#6B6B65] mb-6">School management &amp; administration</p>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <label className="block text-sm text-[#6B6B65] mb-1">Email</label>
                            <input type="email" placeholder="admin@school.edu" value={loginData.email} onChange={(e) => setLoginData({...loginData, email: e.target.value})} className="w-full p-2.5 rounded-lg bg-white/80 border border-[#D8D6CC] text-[#1F2937] focus:ring-2 focus:ring-[#3B5BA5] focus:border-[#3B5BA5] outline-none transition" required />
                        </div>
                        <div>
                            <label className="block text-sm text-[#6B6B65] mb-1">Password</label>
                            <input type="password" placeholder="Password" value={loginData.password} onChange={(e) => setLoginData({...loginData, password: e.target.value})} className="w-full p-2.5 rounded-lg bg-white/80 border border-[#D8D6CC] text-[#1F2937] focus:ring-2 focus:ring-[#3B5BA5] focus:border-[#3B5BA5] outline-none transition" required />
                        </div>
                        <button type="submit" className="w-full bg-[#1F2937] hover:bg-black text-white p-2.5 rounded-lg font-medium transition-colors shadow-lg shadow-[#1F2937]/20">
                            Sign in
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    // --- MAIN DASHBOARD ---
    return (
        <div className="relative h-screen flex flex-col bg-[#FAFAF7] text-[#1F2937] overflow-hidden">
            {/* Decorative blobs behind the glass header/sidebar - subtle, low opacity */}
            <div className="absolute -top-20 left-1/4 w-96 h-96 bg-[#3B5BA5]/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute top-1/3 -right-24 w-96 h-96 bg-[#A9822B]/10 rounded-full blur-3xl pointer-events-none"></div>

            {/* Term strip replaces the generic top bar */}
            <header className="relative h-14 bg-white/70 backdrop-blur-md border-b border-white/50 flex items-center justify-between px-6 z-20">
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
                    <div className="w-7 h-7 rounded-full border border-[#D8D6CC] bg-white/60 flex items-center justify-center text-xs font-medium text-[#6B6B65]">
                        {user.name.charAt(0)}
                    </div>
                </div>
            </header>

            <div className="relative flex flex-1 overflow-hidden z-10">
                <aside className="w-64 bg-white/70 backdrop-blur-md border-r border-white/50 flex flex-col text-sm">
                    <div className="p-3 border-b border-[#F0EEE6]">
                        <p className="text-xs text-[#6B6B65] uppercase tracking-wide font-medium mb-2 px-2">Overview</p>
                        <nav className="space-y-1">
                            {sidebarMainLinks.map((link, index) => {
                                const isActive = activeTab === link.label;
                                return (
                                    <button key={index} onClick={() => setActiveTab(link.label)} className={`w-full flex items-center gap-3 px-2 py-2 rounded-lg transition-colors ${isActive ? 'bg-white/70' : 'hover:bg-white/50'}`}>
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-gradient-to-br shadow-sm ${isActive ? link.gradient : link.tint}`}>
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
                                    <button key={index} onClick={() => setActiveTab(link.label)} className={`w-full flex items-center gap-3 px-2 py-2 rounded-lg transition-colors ${isActive ? 'bg-white/70' : 'hover:bg-white/50'}`}>
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-gradient-to-br shadow-sm ${isActive ? link.gradient : link.tint}`}>
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

                    <div className="bg-white/60 backdrop-blur-md border-b border-white/50 px-6 py-4 flex justify-between items-center">
                        <div>
                            <h1 className="text-xl font-serif text-[#1F2937]">{activeTab}</h1>
                            <p className="text-xs text-[#6B6B65] mt-0.5">View and manage your school's real-time data.</p>
                        </div>
                        <div className="relative w-64">
                            <Search size={14} className="absolute left-3 top-3 text-[#9C9A90]" />
                            <input placeholder={`Search ${activeTab}...`} className="w-full pl-8 pr-3 py-2 rounded-lg bg-white/70 border border-white/60 text-sm outline-none focus:border-[#3B5BA5] focus:bg-white transition" />
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
    const [teacherCount, setTeacherCount] = useState(null);

    useEffect(() => {
        api.get('/fees/stats').then(res => setStats(res.data)).catch(err => console.error(err));
        api.get('/auth/users').then(res => {
            setTeacherCount(res.data.filter(u => u.role === 'teacher').length);
        }).catch(err => console.error(err));
    }, []);

    const collectionRate = stats ? Math.round((stats.paid / (stats.paid + stats.unpaid)) * 100) : 0;

    const studentsByClass = [
        { name: 'Grade 8', count: 62 },
        { name: 'Grade 9', count: 74 },
        { name: 'Grade 10', count: 68 },
        { name: 'Grade 11', count: 55 },
        { name: 'Grade 12', count: 41 },
    ];

    const incomeVsExpenses = [
        { month: 'Apr', income: 18400, expenses: 12100 },
        { month: 'May', income: 21200, expenses: 13400 },
        { month: 'Jun', income: 19800, expenses: 14200 },
        { month: 'Jul', income: 23600, expenses: 12800 },
        { month: 'Aug', income: 25100, expenses: 15300 },
    ];

    const attendanceTrend = [
        { day: 'Mon', rate: 96 },
        { day: 'Tue', rate: 94 },
        { day: 'Wed', rate: 91 },
        { day: 'Thu', rate: 95 },
        { day: 'Fri', rate: 89 },
    ];

    const paymentMethods = [
        { name: 'Mobile Money', value: 45, fill: '#3B5BA5' },
        { name: 'Bank Transfer', value: 30, fill: '#4C7A5A' },
        { name: 'Cash', value: 18, fill: '#A9822B' },
        { name: 'Cheque', value: 7, fill: '#C97A2B' },
    ];

    const upcomingEvents = [
        { id: 1, date: '08 Sep', title: 'Staff meeting', type: 'Meeting', tone: '#A9822B' },
        { id: 2, date: '12 Sep', title: 'Mid-term exams begin', type: 'Academic', tone: '#3B5BA5' },
        { id: 3, date: '19 Sep', title: 'Fee payment deadline', type: 'Deadline', tone: '#C97A2B' },
        { id: 4, date: '25 Sep', title: 'Founders\' Day holiday', type: 'Holiday', tone: '#4C7A5A' },
    ];

    const recentActivity = [
        { id: 1, name: 'Isaac', action: 'paid fees', amount: 'GHS 5,000', time: '2m ago', icon: <DollarSign size={16} />, tone: 'text-[#4C7A5A] bg-[#EAF3EE]' },
        { id: 2, name: 'Dr. Mensah', action: 'updated DCIT 201 grades', amount: '', time: '15m ago', icon: <GraduationCap size={16} />, tone: 'text-[#3B5BA5] bg-[#EAF0FA]' },
        { id: 3, name: 'Ama', action: 'enrolled in Operating Systems', amount: '', time: '1h ago', icon: <BookOpen size={16} />, tone: 'text-[#A9822B] bg-[#F7EFDD]' },
    ];

    return (
        <div className="space-y-6">
            {/* Top Metric Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                <div className="bg-white border border-[#E5E3DA] p-6 border-t-2 border-t-[#3B5BA5]">
                    <div className="flex items-center justify-between mb-4">
                        <Users size={20} className="text-[#3B5BA5]" />
                        <span className="text-xs font-medium text-[#4C7A5A]">+12% this month</span>
                    </div>
                    <p className="text-sm text-[#6B6B65]">Total students</p>
                    <p className="text-3xl font-serif text-[#1F2937] mt-1">{stats ? stats.paidCount + stats.unpaidCount : 0}</p>
                </div>

                <div className="bg-white border border-[#E5E3DA] p-6 border-t-2 border-t-[#A9822B]">
                    <div className="flex items-center justify-between mb-4">
                        <UserCheck size={20} className="text-[#A9822B]" />
                        <span className="text-xs font-medium text-[#6B6B65]">Staff</span>
                    </div>
                    <p className="text-sm text-[#6B6B65]">Total teachers</p>
                    <p className="text-3xl font-serif text-[#1F2937] mt-1">{teacherCount !== null ? teacherCount : 0}</p>
                </div>

                <div className="bg-white border border-[#E5E3DA] p-6 border-t-2 border-t-[#4C7A5A]">
                    <div className="flex items-center justify-between mb-4">
                        <DollarSign size={20} className="text-[#4C7A5A]" />
                        <span className="text-xs font-medium text-[#6B6B65]">GHS</span>
                    </div>
                    <p className="text-sm text-[#6B6B65]">Total income</p>
                    <p className="text-3xl font-serif text-[#1F2937] mt-1">{stats ? stats.paid.toLocaleString() : 0}</p>
                </div>

                <div className="bg-white border border-[#E5E3DA] p-6 border-t-2 border-t-[#C97A2B]">
                    <div className="flex items-center justify-between mb-4">
                        <AlertTriangle size={20} className="text-[#C97A2B]" />
                        <span className="text-xs font-medium text-[#C97A2B]">Needs review</span>
                    </div>
                    <p className="text-sm text-[#6B6B65]">Outstanding fees</p>
                    <p className="text-3xl font-serif text-[#1F2937] mt-1">{stats ? stats.unpaid.toLocaleString() : 0}</p>
                </div>
            </div>

                        {/* Row 2: Calendar & Event Details */}
            <CalendarView />

            {/* Row 3: Students by Class & Fee Collection */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white border border-[#E5E3DA]">
                    <div className="p-5 border-b border-[#F0EEE6] flex justify-between items-center">
                        <div>
                            <h2 className="text-base font-serif text-[#1F2937]">Students by class</h2>
                            <p className="text-xs text-[#6B6B65] mt-0.5">Current enrollment across grade levels</p>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-[#9C9A90] cursor-pointer hover:text-[#6B6B65]">
                            <span>This term</span>
                            <ChevronDown size={14} />
                        </div>
                    </div>
                    <div className="p-5 h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={studentsByClass} layout="vertical" margin={{ left: 10 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#F0EEE6" horizontal={false} />
                                <XAxis type="number" stroke="#9C9A90" fontSize={12} axisLine={false} tickLine={false} />
                                <YAxis type="category" dataKey="name" stroke="#9C9A90" fontSize={12} axisLine={false} tickLine={false} width={60} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #E5E3DA', borderRadius: '2px', boxShadow: 'none' }}
                                    cursor={{ fill: '#FAFAF7' }}
                                />
                                <Bar dataKey="count" fill="#3B5BA5" radius={[0, 2, 2, 0]} barSize={22} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white border border-[#E5E3DA] p-5 flex flex-col">
                    <h2 className="text-base font-serif text-[#1F2937]">Fee collection</h2>
                    <p className="text-xs text-[#6B6B65] mt-0.5 mb-5">Collected vs. outstanding, this term</p>

                    <div className="flex items-end gap-2 mb-2">
                        <span className="text-4xl font-serif text-[#1F2937]">{collectionRate}%</span>
                        <span className="text-xs text-[#6B6B65] mb-1.5">collected</span>
                    </div>
                    <div className="h-2 bg-[#FBF1E3] mb-6">
                        <div className="h-2 bg-[#4C7A5A]" style={{ width: `${collectionRate}%` }}></div>
                    </div>

                    <div className="space-y-3 text-sm mt-auto">
                        <div className="flex justify-between items-center">
                            <span className="flex items-center gap-2 text-[#6B6B65]"><span className="w-2 h-2 bg-[#4C7A5A] rounded-full"></span>Collected</span>
                            <span className="font-medium text-[#1F2937]">GHS {stats ? stats.paid.toLocaleString() : 0}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="flex items-center gap-2 text-[#6B6B65]"><span className="w-2 h-2 bg-[#C97A2B] rounded-full"></span>Outstanding</span>
                            <span className="font-medium text-[#1F2937]">GHS {stats ? stats.unpaid.toLocaleString() : 0}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Row 3: Income vs Expenses (Left) & Fee Collection (Right) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white border border-[#E5E3DA]">
                    <div className="p-5 border-b border-[#F0EEE6] flex justify-between items-center">
                        <div>
                            <h2 className="text-base font-serif text-[#1F2937]">Income vs. expenses</h2>
                            <p className="text-xs text-[#6B6B65] mt-0.5">Last 5 months</p>
                        </div>
                    </div>
                    <div className="p-5 h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={incomeVsExpenses}>
                                <defs>
                                    <linearGradient id="incomeFill" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#4C7A5A" stopOpacity={0.35} />
                                        <stop offset="95%" stopColor="#4C7A5A" stopOpacity={0.02} />
                                    </linearGradient>
                                    <linearGradient id="expensesFill" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#C97A2B" stopOpacity={0.35} />
                                        <stop offset="95%" stopColor="#C97A2B" stopOpacity={0.02} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#F0EEE6" vertical={false} />
                                <XAxis dataKey="month" stroke="#9C9A90" fontSize={12} axisLine={false} tickLine={false} />
                                <YAxis stroke="#9C9A90" fontSize={12} axisLine={false} tickLine={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #E5E3DA', borderRadius: '2px', boxShadow: 'none' }}
                                />
                                <Legend wrapperStyle={{ fontSize: '12px' }} />
                                <Area type="monotone" dataKey="income" name="Income" stroke="#4C7A5A" fill="url(#incomeFill)" strokeWidth={2} />
                                <Area type="monotone" dataKey="expenses" name="Expenses" stroke="#C97A2B" fill="url(#expensesFill)" strokeWidth={2} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white border border-[#E5E3DA] p-5 flex flex-col">
                    <h2 className="text-base font-serif text-[#1F2937]">Fee collection</h2>
                    <p className="text-xs text-[#6B6B65] mt-0.5 mb-5">Collected vs. outstanding, this term</p>

                    <div className="flex items-end gap-2 mb-2">
                        <span className="text-4xl font-serif text-[#1F2937]">{collectionRate}%</span>
                        <span className="text-xs text-[#6B6B65] mb-1.5">collected</span>
                    </div>
                    <div className="h-2 bg-[#FBF1E3] mb-6">
                        <div className="h-2 bg-[#4C7A5A]" style={{ width: `${collectionRate}%` }}></div>
                    </div>

                    <div className="space-y-3 text-sm mt-auto">
                        <div className="flex justify-between items-center">
                            <span className="flex items-center gap-2 text-[#6B6B65]"><span className="w-2 h-2 bg-[#4C7A5A] rounded-full"></span>Collected</span>
                            <span className="font-medium text-[#1F2937]">GHS {stats ? stats.paid.toLocaleString() : 0}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="flex items-center gap-2 text-[#6B6B65]"><span className="w-2 h-2 bg-[#C97A2B] rounded-full"></span>Outstanding</span>
                            <span className="font-medium text-[#1F2937]">GHS {stats ? stats.unpaid.toLocaleString() : 0}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Row 4: Attendance Trend (Left) & Payment Methods (Right) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white border border-[#E5E3DA]">
                    <div className="p-5 border-b border-[#F0EEE6]">
                        <h2 className="text-base font-serif text-[#1F2937]">Attendance trend</h2>
                        <p className="text-xs text-[#6B6B65] mt-0.5">Daily attendance rate, this week</p>
                    </div>
                    <div className="p-5 h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={attendanceTrend}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#F0EEE6" vertical={false} />
                                <XAxis dataKey="day" stroke="#9C9A90" fontSize={12} axisLine={false} tickLine={false} />
                                <YAxis domain={[80, 100]} stroke="#9C9A90" fontSize={12} axisLine={false} tickLine={false} />
                                <Tooltip contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #E5E3DA', borderRadius: '2px', boxShadow: 'none' }} />
                                <Line type="monotone" dataKey="rate" name="Attendance %" stroke="#3B5BA5" strokeWidth={2} dot={{ r: 4, fill: '#3B5BA5' }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white border border-[#E5E3DA] flex flex-col">
                    <div className="p-5 border-b border-[#F0EEE6]">
                        <h2 className="text-base font-serif text-[#1F2937]">Payment methods</h2>
                        <p className="text-xs text-[#6B6B65] mt-0.5">Share of fees collected this term</p>
                    </div>
                    <div className="p-5 flex-1 flex flex-col items-center justify-center">
                        <div className="w-full h-44">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={paymentMethods} dataKey="value" nameKey="name" innerRadius={45} outerRadius={65} paddingAngle={2}>
                                        {paymentMethods.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.fill} />
                                        ))}
                                    </Pie>
                                    <Tooltip contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #E5E3DA', borderRadius: '2px', boxShadow: 'none' }} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="w-full grid grid-cols-2 gap-2 mt-2">
                            {paymentMethods.map((method, index) => (
                                <div key={index} className="flex items-center gap-1.5 text-xs text-[#4B4B47]">
                                    <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: method.fill }}></span>
                                    {method.name} <span className="text-[#9C9A90]">{method.value}%</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Row 5: Recent Activity & Upcoming Events */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white border border-[#E5E3DA]">
                    <div className="p-5 border-b border-[#F0EEE6] flex justify-between items-center">
                        <div>
                            <h2 className="text-base font-serif text-[#1F2937]">Recent activity</h2>
                            <p className="text-xs text-[#6B6B65] mt-0.5">Latest updates from the school</p>
                        </div>
                        <Bell size={16} className="text-[#9C9A90]" />
                    </div>
                    <div className="p-5 grid grid-cols-1 md:grid-cols-3 gap-5">
                        {recentActivity.map(activity => (
                            <div key={activity.id} className="flex items-start gap-3">
                                <div className={`w-9 h-9 flex items-center justify-center shrink-0 ${activity.tone}`}>
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

                <div className="bg-white border border-[#E5E3DA] flex flex-col">
                    <div className="p-5 border-b border-[#F0EEE6] flex justify-between items-center">
                        <h2 className="text-base font-serif text-[#1F2937]">Upcoming events</h2>
                        <Calendar size={16} className="text-[#9C9A90]" />
                    </div>
                    <div className="flex-1">
                        {upcomingEvents.map(event => (
                            <div key={event.id} className="flex items-center gap-3 px-5 py-3.5 border-b border-[#F0EEE6] last:border-b-0">
                                <div className="w-1 self-stretch rounded-full" style={{ backgroundColor: event.tone }}></div>
                                <div className="flex-1">
                                    <p className="text-sm text-[#1F2937] font-medium">{event.title}</p>
                                    <p className="text-xs text-[#9C9A90] mt-0.5">{event.date} · {event.type}</p>
                                </div>
                            </div>
                        ))}
                    </div>
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
                <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white/80 backdrop-blur-xl border border-white/60 shadow-2xl rounded-2xl w-full max-w-md p-6 relative">
                        <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-[#9C9A90] hover:text-[#1F2937]">
                            <X size={18} />
                        </button>
                        <h3 className="text-lg font-serif text-[#1F2937] mb-4">Add new student</h3>
                        <form onSubmit={handleAddStudent} className="space-y-3">
                            <input type="text" placeholder="Full name" value={newStudent.name} onChange={(e) => setNewStudent({...newStudent, name: e.target.value})} className="w-full p-2 rounded-lg bg-white/80 border border-[#D8D6CC] text-sm focus:border-[#3B5BA5] outline-none" required />
                            <input type="email" placeholder="Email address" value={newStudent.email} onChange={(e) => setNewStudent({...newStudent, email: e.target.value})} className="w-full p-2 rounded-lg bg-white/80 border border-[#D8D6CC] text-sm focus:border-[#3B5BA5] outline-none" required />
                            <input type="text" placeholder="Student ID (e.g., UCC1234)" value={newStudent.studentId} onChange={(e) => setNewStudent({...newStudent, studentId: e.target.value})} className="w-full p-2 rounded-lg bg-white/80 border border-[#D8D6CC] text-sm focus:border-[#3B5BA5] outline-none" required />
                            <div className="flex justify-end gap-2 pt-4">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="text-sm text-[#6B6B65] border border-[#D8D6CC] rounded-lg px-3 py-1.5 hover:bg-white">Cancel</button>
                                <button type="submit" className="text-sm text-white bg-[#3B5BA5] rounded-lg px-3 py-1.5 hover:bg-[#2A4380] shadow-lg shadow-[#3B5BA5]/30">Save student</button>
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
                <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white/80 backdrop-blur-xl border border-white/60 shadow-2xl rounded-2xl w-full max-w-md p-6 relative">
                        <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-[#9C9A90] hover:text-[#1F2937]">
                            <X size={18} />
                        </button>
                        <h3 className="text-lg font-serif text-[#1F2937] mb-4">Add new course</h3>
                        <form onSubmit={handleAddCourse} className="space-y-3">
                            <input type="text" placeholder="Course title (e.g., Calculus)" value={newCourse.title} onChange={(e) => setNewCourse({...newCourse, title: e.target.value})} className="w-full p-2 rounded-lg bg-white/80 border border-[#D8D6CC] text-sm focus:border-[#3B5BA5] outline-none" required />
                            <input type="text" placeholder="Course code (e.g., MATH 101)" value={newCourse.code} onChange={(e) => setNewCourse({...newCourse, code: e.target.value})} className="w-full p-2 rounded-lg bg-white/80 border border-[#D8D6CC] text-sm focus:border-[#3B5BA5] outline-none" required />
                            <input type="number" placeholder="Credits" value={newCourse.credits} onChange={(e) => setNewCourse({...newCourse, credits: parseInt(e.target.value)})} className="w-full p-2 rounded-lg bg-white/80 border border-[#D8D6CC] text-sm focus:border-[#3B5BA5] outline-none" required />
                            <div className="flex justify-end gap-2 pt-4">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="text-sm text-[#6B6B65] border border-[#D8D6CC] rounded-lg px-3 py-1.5 hover:bg-white">Cancel</button>
                                <button type="submit" className="text-sm text-white bg-[#3B5BA5] rounded-lg px-3 py-1.5 hover:bg-[#2A4380] shadow-lg shadow-[#3B5BA5]/30">Save course</button>
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

const CalendarView = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(null);

    const events = {
        5: { title: 'Staff Meeting', tone: '#A9822B' },
        12: { title: 'Mid-term Exams', tone: '#3B5BA5' },
        19: { title: 'Fee Deadline', tone: '#C97A2B' },
        25: { title: 'Founders\' Day', tone: '#4C7A5A' }
    };

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const today = new Date();

    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
    const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

    const blanks = Array.from({ length: firstDayOfMonth }, () => null);
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Calendar Grid - Fixed height to match the chart next to it */}
            <div className="bg-white border border-[#E5E3DA] h-[332px] flex flex-col">
                <div className="flex items-center justify-between p-5 border-b border-[#F0EEE6]">
                    <h2 className="text-base font-serif text-[#1F2937]">{monthNames[month]} {year}</h2>
                    <div className="flex gap-2">
                        <button onClick={prevMonth} className="p-1.5 border border-[#D8D6CC] rounded-md hover:bg-[#FAFAF7] text-[#6B6B65]">
                            <ChevronDown size={14} className="rotate-90" />
                        </button>
                        <button onClick={nextMonth} className="p-1.5 border border-[#D8D6CC] rounded-md hover:bg-[#FAFAF7] text-[#6B6B65]">
                            <ChevronDown size={14} className="-rotate-90" />
                        </button>
                    </div>
                </div>

                {/* Make the calendar scrollable if it overflows */}
                <div className="flex-1 overflow-y-auto p-4">
                    <div className="grid grid-cols-7 gap-1 text-center">
                        {dayNames.map(day => (
                            <div key={day} className="text-[10px] font-medium text-[#9C9A90] uppercase tracking-wide pb-2">
                                {day}
                            </div>
                        ))}

                        {blanks.map((_, i) => (
                            <div key={`blank-${i}`} className="h-16"></div>
                        ))}

                        {days.map(day => {
                            const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
                            const hasEvent = events[day];
                            const isSelected = selectedDate === day;

                            return (
                                <button 
                                    key={day} 
                                    onClick={() => setSelectedDate(day)}
                                    className={`h-16 p-1.5 border rounded-md flex flex-col items-start justify-start text-left transition-colors ${
                                        isSelected ? 'border-[#3B5BA5] bg-[#EAF0FA]' : 'border-transparent hover:bg-[#FAFAF7]'
                                    }`}
                                >
                                    <span className={`text-xs ${isToday ? 'bg-[#3B5BA5] text-white w-5 h-5 flex items-center justify-center rounded-full' : 'text-[#1F2937]'}`}>
                                        {day}
                                    </span>
                                    {hasEvent && (
                                        <div className="mt-auto w-full">
                                            <div className="w-1.5 h-1.5 rounded-full mb-0.5" style={{ backgroundColor: hasEvent.tone }}></div>
                                            <p className="text-[9px] text-[#6B6B65] truncate w-full">{hasEvent.title}</p>
                                        </div>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Event Details Sidebar */}
            <div className="lg:col-span-2 bg-white border border-[#E5E3DA] p-5 flex flex-col">
                <h3 className="text-base font-serif text-[#1F2937] mb-1">Event Details</h3>
                <p className="text-xs text-[#6B6B65] mb-5">
                    {selectedDate ? `${monthNames[month]} ${selectedDate}, ${year}` : 'Select a day on the calendar to view events'}
                </p>

                <div className="space-y-3 flex-1">
                    {selectedDate && events[selectedDate] ? (
                        <div className="p-4 border-l-4 bg-[#FAFAF7]" style={{ borderColor: events[selectedDate].tone }}>
                            <p className="text-sm font-medium text-[#1F2937]">{events[selectedDate].title}</p>
                            <p className="text-xs text-[#9C9A90] mt-1">All day event · {monthNames[month]} {selectedDate}</p>
                            <button className="mt-3 text-xs text-[#3B5BA5] hover:text-[#2A4380] font-medium">View details →</button>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-center">
                            <Calendar size={28} className="text-[#D8D6CC] mb-3" />
                            <p className="text-sm text-[#9C9A90]">
                                {selectedDate ? 'No events scheduled for this day.' : 'Click on a highlighted day to see event details.'}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
export default App;
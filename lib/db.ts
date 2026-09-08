import fs from 'fs';
import path from 'path';

const dataDir = path.join(process.cwd(), 'data');
const usersFile = path.join(dataDir, 'users.json');
const dashboardFile = path.join(dataDir, 'dashboard.json');
const facultyDashboardFile = path.join(dataDir, 'faculty_dashboard.json');
const aiChatFile = path.join(dataDir, 'ai_chats.json');
const sharedChatsFile = path.join(dataDir, 'shared_chats.json');

// Default dashboard data
const defaultDashboardData = {
    stats: {
        upcomingClassesCount: 3,
        pendingAssignmentsCount: 2,
        unreadNoticesCount: 5,
        progressPercentage: 78,
    },
    upcomingClasses: [
        {
            id: "1",
            subject: "DBMS",
            time: "10:00 AM – 11:00 AM",
            room: "Room 302",
            instructor: "Dr. Sharma",
            color: "bg-gradient-to-b from-[#8b48f5] to-[#66b3ef]",
        },
        {
            id: "2",
            subject: "AI",
            time: "11:30 AM – 12:30 PM",
            room: "Lab 4",
            instructor: "Prof. Alan",
            color: "bg-gradient-to-b from-[#0cb2b7] to-[#71d1e5]",
        },
        {
            id: "3",
            subject: "ML",
            time: "02:00 PM – 03:00 PM",
            room: "Seminar Hall A",
            instructor: "Dr. Mehta",
            color: "bg-gradient-to-b from-[#ff303d] to-[#ff9ca4]"
        }
    ],
    assignments: [
        {
            id: "1",
            title: "DBMS Mini Project",
            due: "15 Sep 2025",
            status: "In Progress",
            category: "Upcoming"
        },
        {
            id: "2",
            title: "AI Research Paper",
            due: "20 Sep 2025",
            status: "Not Started",
            category: "Upcoming"
        },
        {
            id: "3",
            title: "NLP Assignment",
            due: "25 Sep 2025",
            status: "Overdue",
            category: "Overdue"
        },
        {
            id: "4",
            title: "Web Development Project",
            due: "30 Sep 2025",
            status: "Submitted",
            category: "Submitted"
        }
    ],
    notices: [
        {
            id: "1",
            title: "Exam timetable released",
            department: "Examination Cell",
            date: "Today",
            category: "Urgent",
            read: false
        },
        {
            id: "2",
            title: "College event registration",
            department: "Student Council",
            date: "Yesterday",
            category: "Event",
            read: false
        },
        {
            id: "3",
            title: "Assignment submission notice",
            department: "CSE Department",
            date: "2 days ago",
            category: "Academic",
            read: false
        },
        {
            id: "4",
            title: "Holiday on 5th September",
            department: "Admin",
            date: "3 days ago",
            category: "General",
            read: false
        },
        {
            id: "5",
            title: "Library timing extended",
            department: "Library",
            date: "4 days ago",
            category: "Academic",
            read: false
        }
    ],
    materials: [],
    timetable: []
};

// Default AI Chat history
const defaultAIChats = [
    {
        id: "1",
        role: "user",
        content: "Explain operating system scheduling in simple words.",
        timestamp: "10:34 AM"
    },
    {
        id: "2",
        role: "assistant",
        content: "Operating System scheduling is the process of deciding which process should get the CPU at a particular time. It helps in efficient use of system resources and improves performance, fairness and responsiveness.",
        keyPoints: [
            "FCFS (First Come First Serve)",
            "SJF (Shortest Job First)",
            "Priority Scheduling",
            "Round Robin (time sharing)"
        ],
        sources: ["OS_Unit1.pdf", "Notes.pdf", "Faculty_Notes.pdf"],
        timestamp: "10:34 AM"
    }
];

// Ensure data directory and files exist
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

if (!fs.existsSync(usersFile)) {
    fs.writeFileSync(usersFile, JSON.stringify([]));
}

if (!fs.existsSync(dashboardFile)) {
    fs.writeFileSync(dashboardFile, JSON.stringify(defaultDashboardData, null, 2));
}

const defaultFacultyDashboardData = {
    stats: {
        totalStudents: 120,
        totalCourses: 6,
        pendingAssignments: 8,
        notices: 4,
    },
    courses: [
        { id: "c1", name: "DBMS", code: "CSE-201", students: 42, schedule: "Mon, Wed, Fri • 10:00 AM" },
        { id: "c2", name: "Artificial Intelligence", code: "CSE-305", students: 36, schedule: "Tue, Thu • 11:30 AM" },
        { id: "c3", name: "Machine Learning", code: "CSE-410", students: 29, schedule: "Wed, Fri • 2:00 PM" },
    ],
    students: [
        { id: "s1", name: "Nandini", roll: "22CS101", status: "Present" },
        { id: "s2", name: "Aarav", roll: "22CS102", status: "On Time" },
        { id: "s3", name: "Meera", roll: "22CS103", status: "Needs Review" },
    ],
    assignments: [
        { id: "a1", title: "DBMS Mini Project", due: "15 Sep 2025", status: "In Progress", students: 28 },
        { id: "a2", title: "AI Research Paper", due: "20 Sep 2025", status: "Pending", students: 31 },
        { id: "a3", title: "ML Quiz", due: "24 Sep 2025", status: "Draft", students: 18 },
    ],
    notices: [
        { id: "n1", title: "Exam timetable released", department: "Examination Cell", date: "Today", read: false, category: "Urgent" },
        { id: "n2", title: "Workshop on AI tools", department: "CSE Department", date: "Yesterday", read: true, category: "Event" },
        { id: "n3", title: "Assignment submission window", department: "Academic Office", date: "2 days ago", read: false, category: "Academic" },
    ],
    materials: [
        { id: "m1", title: "AI lecture notes", type: "PDF", uploadedAt: "Today" },
        { id: "m2", title: "DBMS revision set", type: "Slides", uploadedAt: "2 days ago" },
    ],
    recentActivity: [
        { id: "r1", title: "New assignment created - DBMS Mini Project", time: "2 hours ago", type: "assignment" },
        { id: "r2", title: "Material uploaded - AI Notes.pdf", time: "4 hours ago", type: "material" },
        { id: "r3", title: "Notice posted - Exam Schedule", time: "1 day ago", type: "notice" },
    ],
    timetable: [
        { id: "t1", day: "Monday", slot: "10:00 AM", subject: "DBMS", room: "Room 302" },
        { id: "t2", day: "Tuesday", slot: "11:30 AM", subject: "AI", room: "Lab 4" },
    ],
};

if (!fs.existsSync(facultyDashboardFile)) {
    fs.writeFileSync(facultyDashboardFile, JSON.stringify(defaultFacultyDashboardData, null, 2));
}

if (!fs.existsSync(aiChatFile)) {
    fs.writeFileSync(aiChatFile, JSON.stringify(defaultAIChats, null, 2));
}

if (!fs.existsSync(sharedChatsFile)) {
    fs.writeFileSync(sharedChatsFile, JSON.stringify([], null, 2));
}

// User Helpers
export function getUsers() {
    try {
        const data = fs.readFileSync(usersFile, 'utf8');
        return JSON.parse(data) || [];
    } catch {
        return [];
    }
}

export function saveUsers(users: any[]) {
    fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
}

export function findUserByEmailOrId(identifier: string) {
    const users = getUsers();
    return users.find(
        (u: any) => u.email === identifier || u.collegeId === identifier
    );
}

export function findUserById(id: string) {
    const users = getUsers();
    return users.find((u: any) => u.id === id);
}

export function addUser(user: any) {
    const users = getUsers();
    users.push(user);
    saveUsers(users);
}

// Dashboard Helpers
export function getRawDashboardData() {
    try {
        if (!fs.existsSync(dashboardFile)) {
            fs.writeFileSync(dashboardFile, JSON.stringify(defaultDashboardData, null, 2));
            return defaultDashboardData;
        }
        const data = fs.readFileSync(dashboardFile, 'utf8');
        return JSON.parse(data) || defaultDashboardData;
    } catch {
        return defaultDashboardData;
    }
}

export function saveDashboardData(data: any) {
    fs.writeFileSync(dashboardFile, JSON.stringify(data, null, 2));
}

export function getDashboardData(userId?: string) {
    const dbData = getRawDashboardData();
    let userInfo = {
        name: "Student",
        role: "Student",
        email: "student@college.edu",
        profileImage: "",
    };

    if (userId) {
        const found = findUserById(userId);
        if (found) {
            userInfo = {
                name: found.name || "Student",
                role: found.role || "Student",
                email: found.email || "",
                profileImage: found.profileImage || "",
            };
        }
    }

    const upcomingClasses = dbData.upcomingClasses || [];
    const assignments = dbData.assignments || [];
    const notices = dbData.notices || [];
    const timetable = dbData.timetable?.length
        ? dbData.timetable
        : (getRawFacultyDashboardData().timetable || []).map((entry: any) => ({
            ...entry,
            time: entry.time || entry.slot,
            professor: entry.professor || "Faculty",
            iconType: entry.iconType || "doc",
            iconBg: entry.iconBg || "bg-[#eee0ff]",
            iconColor: entry.iconColor || "text-[#8635dc]",
        }));

    const pendingAssignmentsCount = assignments.filter(
        (a: any) => a.status !== "Submitted"
    ).length;

    const unreadNoticesCount = notices.filter(
        (n: any) => !n.read
    ).length;

    const progressPercentage = dbData.stats?.progressPercentage ?? 78;

    return {
        user: userInfo,
        stats: {
            upcomingClassesCount: upcomingClasses.length,
            pendingAssignmentsCount,
            unreadNoticesCount,
            progressPercentage,
        },
        upcomingClasses,
        assignments,
        notices,
        timetable,
    };
}

export function updateDashboardStats(statsUpdates: any) {
    const current = getRawDashboardData();
    current.stats = {
        ...current.stats,
        ...statsUpdates,
    };
    saveDashboardData(current);
    return current.stats;
}

export function addUpcomingClass(newClass: any) {
    const current = getRawDashboardData();
    const id = newClass.id || Date.now().toString();
    const classItem = { id, ...newClass };
    current.upcomingClasses = current.upcomingClasses || [];
    current.upcomingClasses.push(classItem);
    saveDashboardData(current);
    return classItem;
}

export function removeUpcomingClass(classId: string) {
    const current = getRawDashboardData();
    current.upcomingClasses = (current.upcomingClasses || []).filter(
        (c: any) => c.id !== classId
    );
    saveDashboardData(current);
    return true;
}

export function addAssignment(newAssignment: any) {
    const current = getRawDashboardData();
    const id = newAssignment.id || Date.now().toString();
    const item = { id, status: "Not Started", createdAt: new Date().toISOString(), ...newAssignment };
    current.assignments = current.assignments || [];
    current.assignments.push(item);
    saveDashboardData(current);
    return item;
}

export function updateAssignment(assignmentId: string, updates: any) {
    const current = getRawDashboardData();
    current.assignments = (current.assignments || []).map((a: any) => {
        if (a.id === assignmentId) {
            return { ...a, ...updates };
        }
        return a;
    });
    saveDashboardData(current);
    return true;
}

export function addNotice(newNotice: any) {
    const current = getRawDashboardData();
    const id = newNotice.id || Date.now().toString();
    const item = { id, read: false, date: "Just now", createdAt: new Date().toISOString(), ...newNotice };
    current.notices = current.notices || [];
    current.notices.unshift(item);
    saveDashboardData(current);
    return item;
}

export function markNoticeRead(noticeId: string) {
    const current = getRawDashboardData();
    current.notices = (current.notices || []).map((n: any) => {
        if (n.id === noticeId) {
            return { ...n, read: true };
        }
        return n;
    });
    saveDashboardData(current);
    return true;
}

export function getRawFacultyDashboardData() {
    try {
        if (!fs.existsSync(facultyDashboardFile)) {
            fs.writeFileSync(facultyDashboardFile, JSON.stringify(defaultFacultyDashboardData, null, 2));
            return defaultFacultyDashboardData;
        }
        const data = fs.readFileSync(facultyDashboardFile, 'utf8');
        return JSON.parse(data) || defaultFacultyDashboardData;
    } catch {
        return defaultFacultyDashboardData;
    }
}

export function saveFacultyDashboardData(data: any) {
    fs.writeFileSync(facultyDashboardFile, JSON.stringify(data, null, 2));
}

export function getFacultyDashboardData(userId?: string) {
    const dbData = getRawFacultyDashboardData();
    const found = userId ? findUserById(userId) : null;

    return {
        user: {
            name: found?.name || "Dr. Mehta",
            role: found?.role || "Faculty",
            email: found?.email || "faculty@college.edu",
            profileImage: found?.profileImage || "",
        },
        stats: dbData.stats || defaultFacultyDashboardData.stats,
        courses: dbData.courses || [],
        students: dbData.students || [],
        assignments: dbData.assignments || [],
        notices: dbData.notices || [],
        materials: dbData.materials || [],
        recentActivity: dbData.recentActivity || [],
        timetable: dbData.timetable || [],
    };
}

export function updateFacultyDashboardStats(statsUpdates: any) {
    const current = getRawFacultyDashboardData();
    current.stats = { ...(current.stats || defaultFacultyDashboardData.stats), ...statsUpdates };
    saveFacultyDashboardData(current);
    return current.stats;
}

export function addFacultyNotice(newNotice: any) {
    const current = getRawFacultyDashboardData();
    const id = newNotice.id || `n-${Date.now()}`;
    const item = { id, read: false, date: "Just now", createdAt: new Date().toISOString(), ...newNotice };
    current.notices = current.notices || [];
    current.notices.unshift(item);
    current.recentActivity = current.recentActivity || [];
    current.recentActivity.unshift({ id: `r-${Date.now()}`, title: `Notice posted - ${newNotice.title}`, time: "Just now", type: "notice" });
    saveFacultyDashboardData(current);

    addNotice({ ...newNotice, id, source: "faculty" });
    return item;
}

export function addFacultyAssignment(newAssignment: any) {
    const current = getRawFacultyDashboardData();
    const id = newAssignment.id || `a-${Date.now()}`;
    const item = { id, status: "Pending", students: 0, createdAt: new Date().toISOString(), ...newAssignment };
    current.assignments = current.assignments || [];
    current.assignments.unshift(item);
    current.recentActivity = current.recentActivity || [];
    current.recentActivity.unshift({ id: `r-${Date.now()}`, title: `New assignment created - ${newAssignment.title}`, time: "Just now", type: "assignment" });
    saveFacultyDashboardData(current);

    addAssignment({ ...newAssignment, id, source: "faculty" });
    return item;
}

export function addFacultyMaterial(newMaterial: any) {
    const current = getRawFacultyDashboardData();
    const id = newMaterial.id || `m-${Date.now()}`;
    const item = { id, uploadedAt: "Just now", createdAt: new Date().toISOString(), ...newMaterial };
    current.materials = current.materials || [];
    current.materials.unshift(item);
    current.recentActivity = current.recentActivity || [];
    current.recentActivity.unshift({ id: `r-${Date.now()}`, title: `Material uploaded - ${newMaterial.title}`, time: "Just now", type: "material" });
    saveFacultyDashboardData(current);

    const shared = getRawDashboardData();
    shared.materials = shared.materials || [];
    shared.materials.unshift({
        id,
        title: newMaterial.title,
        subject: newMaterial.subject || newMaterial.title,
        semester: newMaterial.semester || "Sem 7",
        type: newMaterial.type || "PDF",
        fileType: newMaterial.type || newMaterial.fileType || "PDF",
        author: newMaterial.author || "Faculty",
        size: newMaterial.size || "",
        uploadedDate: newMaterial.uploadedDate || "Today",
        downloadUrl: newMaterial.downloadUrl || "#",
        source: "faculty",
    });
    saveDashboardData(shared);
    return item;
}

export function addFacultyTimetable(newEntry: any) {
    const current = getRawFacultyDashboardData();
    const id = newEntry.id || `t-${Date.now()}`;
    const item = { id, ...newEntry };
    current.timetable = current.timetable || [];
    current.timetable.push(item);
    saveFacultyDashboardData(current);

    const shared = getRawDashboardData();
    shared.timetable = shared.timetable || [];
    shared.timetable.push({
        ...item,
        time: item.slot,
        professor: item.professor || "Faculty",
        iconType: "doc",
        iconBg: "bg-[#eee0ff]",
        iconColor: "text-[#8635dc]",
        source: "faculty",
    });
    saveDashboardData(shared);
    return item;
}

export function markFacultyNoticeRead(noticeId: string) {
    const current = getRawFacultyDashboardData();
    current.notices = (current.notices || []).map((n: any) => n.id === noticeId ? { ...n, read: true } : n);
    saveFacultyDashboardData(current);
    return true;
}

export function removeFacultyNotice(noticeId: string) {
    const facultyData = getRawFacultyDashboardData();
    facultyData.notices = (facultyData.notices || []).filter((notice: any) => notice.id !== noticeId);
    saveFacultyDashboardData(facultyData);

    const sharedData = getRawDashboardData();
    sharedData.notices = (sharedData.notices || []).filter((notice: any) => notice.id !== noticeId);
    saveDashboardData(sharedData);
    return true;
}

const aiChatStudentFile = path.join(dataDir, 'ai_chats_student.json');
const aiChatFacultyFile = path.join(dataDir, 'ai_chats_faculty.json');

// Default Faculty initial AI message
const defaultFacultyAIChats = [
    {
        id: "1",
        role: "assistant",
        content: "Hello Professor! How can I assist with your lesson plans, course rubrics, exam questions, or official circular notices today?",
        keyPoints: [
            "Generate official academic notices and circulars",
            "Draft lesson plans and assignment rubrics",
            "Create exam quiz questions and explanations"
        ],
        sources: ["Faculty_Teaching_Guide.pdf"],
        timestamp: "10:00 AM"
    }
];

// AI Tutor Chat Helpers
export function getAIChatHistory(role: string = "Student"): any[] {
    try {
        const file = role === "Faculty" ? aiChatFacultyFile : (fs.existsSync(aiChatStudentFile) ? aiChatStudentFile : aiChatFile);
        const defaultInitial = role === "Faculty" ? defaultFacultyAIChats : defaultAIChats;

        if (!fs.existsSync(file)) {
            fs.writeFileSync(file, JSON.stringify(defaultInitial, null, 2));
            return defaultInitial;
        }
        const data = fs.readFileSync(file, 'utf8');
        return JSON.parse(data) || defaultInitial;
    } catch {
        return role === "Faculty" ? defaultFacultyAIChats : defaultAIChats;
    }
}

export function saveAIChatHistory(messages: any[], role: string = "Student") {
    const file = role === "Faculty" ? aiChatFacultyFile : aiChatStudentFile;
    fs.writeFileSync(file, JSON.stringify(messages, null, 2));
}

export function addAIMessage(msg: any, role: string = "Student") {
    const history = getAIChatHistory(role);
    history.push(msg);
    saveAIChatHistory(history, role);
    return msg;
}

export function clearAIChatHistory(role: string = "Student") {
    saveAIChatHistory([], role);
    return true;
}

export function getSharedAIChats(): any[] {
    try {
        if (!fs.existsSync(sharedChatsFile)) {
            fs.writeFileSync(sharedChatsFile, JSON.stringify([], null, 2));
            return [];
        }
        const data = fs.readFileSync(sharedChatsFile, 'utf8');
        return JSON.parse(data) || [];
    } catch {
        return [];
    }
}

export function saveSharedAIChats(chats: any[]) {
    fs.writeFileSync(sharedChatsFile, JSON.stringify(chats, null, 2));
}

export function createSharedAIChat(shareData: { title?: string; messages: any[]; sharedBy?: string }) {
    const chats = getSharedAIChats();
    const id = `share_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
    const newShare = {
        id,
        title: shareData.title || "Shared AI Tutor Chat",
        messages: shareData.messages || [],
        createdAt: new Date().toISOString(),
        sharedBy: shareData.sharedBy || "Student",
    };
    chats.push(newShare);
    saveSharedAIChats(chats);
    return newShare;
}

export function getSharedAIChat(id: string) {
    const chats = getSharedAIChats();
    return chats.find((c: any) => c.id === id) || null;
}

// Admin Database Helpers
export function updateUser(id: string, updates: any) {
    const users = getUsers();
    const index = users.findIndex((u: any) => u.id === id);
    if (index === -1) return null;
    
    users[index] = {
        ...users[index],
        ...updates,
        updatedAt: new Date().toISOString(),
    };
    saveUsers(users);
    return users[index];
}

export function deleteUser(id: string) {
    const users = getUsers();
    const filtered = users.filter((u: any) => u.id !== id);
    if (filtered.length === users.length) return false;
    saveUsers(filtered);
    return true;
}

export function getAdminStats() {
    const users = getUsers();
    const totalUsers = users.length;
    const students = users.filter((u: any) => u.role === "Student").length;
    const faculty = users.filter((u: any) => u.role === "Faculty").length;
    const admins = users.filter((u: any) => u.role === "Admin").length;

    const studentDash = getRawDashboardData();
    const facultyDash = getRawFacultyDashboardData();
    const sharedChats = getSharedAIChats();

    const totalMaterials = (studentDash.materials?.length || 0) + (facultyDash.materials?.length || 0);
    const totalNotices = (studentDash.notices?.length || 0) + (facultyDash.notices?.length || 0);

    return {
        totalUsers,
        students,
        faculty,
        admins,
        totalMaterials,
        totalNotices,
        sharedChatsCount: sharedChats.length,
        usersList: users.map((u: any) => ({
            id: u.id,
            name: u.name,
            email: u.email,
            role: u.role,
            collegeId: u.collegeId,
            createdAt: u.createdAt,
        })),
    };
}

export function getRawTableData(tableName: string) {
    switch (tableName) {
        case "users":
            return getUsers().map((u: any) => ({
                ...u,
                password: "[HASHED_PROTECTED]",
            }));
        case "dashboard":
        case "student_dashboard":
            return getRawDashboardData();
        case "faculty_dashboard":
            return getRawFacultyDashboardData();
        case "ai_chats":
            return getAIChatHistory();
        case "shared_chats":
            return getSharedAIChats();
        default:
            return null;
    }
}



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
const defaultAIChats: any[] = [];

// Default Faculty AI Chat history
const defaultFacultyAIChats: any[] = [];

// Helper to safely write files without crashing on Vercel read-only filesystem
function safeWriteFile(filePath: string, content: string) {
    try {
        const dir = path.dirname(filePath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        fs.writeFileSync(filePath, content, 'utf8');
    } catch (e) {
        // Read-only filesystem on Vercel - silent fallback to in-memory state
    }
}

// In-Memory Fallback Stores for Serverless Environments
let inMemoryUsers: any[] = (() => {
    try {
        if (fs.existsSync(usersFile)) {
            const data = fs.readFileSync(usersFile, 'utf8');
            return JSON.parse(data) || [];
        }
    } catch (e) { }
    return [];
})();

let inMemoryDashboardData: any = (() => {
    try {
        if (fs.existsSync(dashboardFile)) {
            const data = fs.readFileSync(dashboardFile, 'utf8');
            return JSON.parse(data) || defaultDashboardData;
        }
    } catch (e) { }
    return defaultDashboardData;
})();

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

let inMemoryFacultyDashboardData: any = (() => {
    try {
        if (fs.existsSync(facultyDashboardFile)) {
            const data = fs.readFileSync(facultyDashboardFile, 'utf8');
            return JSON.parse(data) || defaultFacultyDashboardData;
        }
    } catch (e) { }
    return defaultFacultyDashboardData;
})();

let inMemorySharedChats: any[] = (() => {
    try {
        if (fs.existsSync(sharedChatsFile)) {
            const data = fs.readFileSync(sharedChatsFile, 'utf8');
            return JSON.parse(data) || [];
        }
    } catch (e) { }
    return [];
})();

// User Helpers
export function getUsers() {
    return inMemoryUsers;
}

export function saveUsers(users: any[]) {
    inMemoryUsers = users;
    safeWriteFile(usersFile, JSON.stringify(users, null, 2));
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
    return inMemoryDashboardData;
}

export function saveDashboardData(data: any) {
    inMemoryDashboardData = data;
    safeWriteFile(dashboardFile, JSON.stringify(data, null, 2));
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
    return inMemoryFacultyDashboardData;
}

export function saveFacultyDashboardData(data: any) {
    inMemoryFacultyDashboardData = data;
    safeWriteFile(facultyDashboardFile, JSON.stringify(data, null, 2));
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



// AI Tutor Chat Helpers
let studentAIChatMemory: any[] = (() => {
    try {
        if (fs.existsSync(aiChatStudentFile)) {
            const data = fs.readFileSync(aiChatStudentFile, 'utf8');
            return JSON.parse(data) || [];
        }
    } catch (e) { }
    return [];
})();

let facultyAIChatMemory: any[] = (() => {
    try {
        if (fs.existsSync(aiChatFacultyFile)) {
            const data = fs.readFileSync(aiChatFacultyFile, 'utf8');
            return JSON.parse(data) || [];
        }
    } catch (e) { }
    return [];
})();

export function getAIChatHistory(role: string = "Student"): any[] {
    return role === "Faculty"
        ? facultyAIChatMemory
        : studentAIChatMemory;
}

export function saveAIChatHistory(
    messages: any[],
    role: string = "Student"
) {
    if (role === "Faculty") {
        facultyAIChatMemory = messages;
        safeWriteFile(aiChatFacultyFile, JSON.stringify(messages, null, 2));
    } else {
        studentAIChatMemory = messages;
        safeWriteFile(aiChatStudentFile, JSON.stringify(messages, null, 2));
    }
}

export function addAIMessage(
    msg: any,
    role: string = "Student"
) {
    const history = getAIChatHistory(role);
    const updatedHistory = [...history, msg];

    saveAIChatHistory(updatedHistory, role);

    return msg;
}

export function clearAIChatHistory(
    role: string = "Student"
) {
    saveAIChatHistory([], role);
    return true;
}


export function getSharedAIChats(): any[] {
    return inMemorySharedChats;
}

export function saveSharedAIChats(chats: any[]) {
    inMemorySharedChats = chats;
    safeWriteFile(sharedChatsFile, JSON.stringify(chats, null, 2));
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



import { NextResponse } from "next/server";
import { getRawDashboardData } from "@/lib/db";

const fallbackMaterials = [
    // Sem 7
    { id: "1", title: "Database Management Systems Notes", subject: "Database Management Systems", semester: "Sem 7", type: "pdf-purple", fileType: "PDF", author: "Dr. Sharma", size: "1.8 MB", uploadedDate: "10 Aug 2025", downloadUrl: "#" },
    { id: "2", title: "Artificial Intelligence Lecture Slides", subject: "Artificial Intelligence", semester: "Sem 7", type: "pdf", fileType: "PDF", author: "Prof. Alan", size: "2.4 MB", uploadedDate: "12 Aug 2025", downloadUrl: "#" },
    { id: "3", title: "Machine Learning Model Evaluation", subject: "Machine Learning Notes", semester: "Sem 7", type: "ppt", fileType: "PPT", author: "Dr. Mehta", size: "4.2 MB", uploadedDate: "08 Aug 2025", downloadUrl: "#" },
    { id: "4", title: "NLP Introduction & Text Processing", subject: "NLP Introduction", semester: "Sem 7", type: "pdf", fileType: "PDF", author: "Prof. Alan", size: "2.1 MB", uploadedDate: "06 Aug 2025", downloadUrl: "#" },
    { id: "5", title: "Computer Networks Protocols Guide", subject: "Computer Networks", semester: "Sem 7", type: "pdf-blue", fileType: "PDF", author: "Dr. Sharma", size: "3.6 MB", uploadedDate: "02 Aug 2025", downloadUrl: "#" },
    
    // Sem 6
    { id: "6", title: "Web Technologies & Modern Frameworks", subject: "Web Technologies", semester: "Sem 6", type: "pdf", fileType: "PDF", author: "Prof. R. Verma", size: "3.1 MB", uploadedDate: "15 Jan 2025", downloadUrl: "#" },
    { id: "7", title: "Design & Analysis of Algorithms", subject: "Algorithms", semester: "Sem 6", type: "ppt", fileType: "PPT", author: "Dr. K. Patel", size: "5.0 MB", uploadedDate: "18 Jan 2025", downloadUrl: "#" },
    { id: "8", title: "Compiler Design Architecture", subject: "Compiler Design", semester: "Sem 6", type: "pdf-purple", fileType: "PDF", author: "Dr. S. Sharma", size: "2.8 MB", uploadedDate: "20 Jan 2025", downloadUrl: "#" },

    // Sem 5
    { id: "9", title: "Operating Systems Core Concepts", subject: "Operating Systems", semester: "Sem 5", type: "pdf-blue", fileType: "PDF", author: "Dr. P. Deshmukh", size: "2.9 MB", uploadedDate: "10 Aug 2024", downloadUrl: "#" },
    { id: "10", title: "Software Engineering Agile Methodology", subject: "Software Engineering", semester: "Sem 5", type: "ppt", fileType: "PPT", author: "Prof. M. Gupta", size: "4.1 MB", uploadedDate: "14 Aug 2024", downloadUrl: "#" },

    // Sem 8
    { id: "11", title: "Cloud Computing & DevOps Pipelines", subject: "Cloud Computing", semester: "Sem 8", type: "pdf", fileType: "PDF", author: "Dr. A. Nambiar", size: "3.8 MB", uploadedDate: "05 Feb 2026", downloadUrl: "#" },
    { id: "12", title: "Cyber Security & Cryptography Handbook", subject: "Cyber Security", semester: "Sem 8", type: "pdf-purple", fileType: "PDF", author: "Prof. R. Singhania", size: "2.7 MB", uploadedDate: "10 Feb 2026", downloadUrl: "#" },
];

// GET /api/student/materials - Fetch materials with optional search & filter
export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const query = searchParams.get("search")?.toLowerCase() || "";
        const subjectFilter = searchParams.get("subject") || "All Subjects";
        const typeFilter = searchParams.get("type") || "All Types";

        const stored = getRawDashboardData().materials;
        let filtered = stored?.length ? stored : fallbackMaterials;

        if (subjectFilter !== "All Subjects") {
            filtered = filtered.filter((m: any) => m.subject.toLowerCase() === subjectFilter.toLowerCase());
        }

        if (typeFilter !== "All Types") {
            filtered = filtered.filter((m: any) => m.fileType.toLowerCase() === typeFilter.toLowerCase());
        }

        if (query) {
            filtered = filtered.filter((m: any) =>
                m.title.toLowerCase().includes(query) ||
                m.subject.toLowerCase().includes(query) ||
                m.author.toLowerCase().includes(query)
            );
        }

        return NextResponse.json({
            success: true,
            count: filtered.length,
            materials: filtered
        }, { status: 200 });
    } catch (error) {
        console.error("Materials GET Error:", error);
        return NextResponse.json({ error: "Failed to fetch materials" }, { status: 500 });
    }
}

// POST /api/student/materials - Upload/Add new course material
export async function POST(req: Request) {
    try {
        const body = await req.json();
        if (!body.title || !body.subject) {
            return NextResponse.json({ error: "Title and subject are required" }, { status: 400 });
        }

        const isPpt = body.type?.toLowerCase().includes("ppt") || body.title?.toLowerCase().includes("ppt");
        const newItem = {
            id: Date.now().toString(),
            title: body.title.trim(),
            subject: body.subject.trim(),
            semester: body.semester || "Sem 7",
            type: isPpt ? "ppt" : (body.type || "pdf"),
            fileType: isPpt ? "PPT" : "PDF",
            author: body.author || "Faculty",
            size: body.size || "2.5 MB",
            uploadedDate: new Date().toLocaleDateString("en-GB", { day: '2-digit', month: 'short', year: 'numeric' }),
            downloadUrl: "#",
        };

        const dashboard = getRawDashboardData();
        dashboard.materials = dashboard.materials || [];
        dashboard.materials.unshift(newItem);
        const { saveDashboardData } = await import("@/lib/db");
        saveDashboardData(dashboard);
        return NextResponse.json({ success: true, material: newItem }, { status: 201 });
    } catch (error) {
        console.error("Materials POST Error:", error);
        return NextResponse.json({ error: "Failed to add material" }, { status: 500 });
    }
}

// DELETE /api/student/materials - Delete material item
export async function DELETE(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json({ error: "Material ID is required" }, { status: 400 });
        }

        const dashboard = getRawDashboardData();
        dashboard.materials = (dashboard.materials || []).filter((m: any) => m.id !== id);
        const { saveDashboardData } = await import("@/lib/db");
        saveDashboardData(dashboard);
        return NextResponse.json({ success: true, message: "Material deleted successfully" }, { status: 200 });
    } catch (error) {
        console.error("Materials DELETE Error:", error);
        return NextResponse.json({ error: "Failed to delete material" }, { status: 500 });
    }
}

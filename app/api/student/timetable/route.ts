import { NextResponse } from "next/server";
import { getDashboardData, addUpcomingClass, removeUpcomingClass } from "@/lib/db";

// Default full weekly timetable schedule
let timetableData = [
    {
        id: "1",
        time: "09:00 – 10:00",
        subject: "AI",
        room: "Room 101",
        professor: "Prof. Alan",
        day: "Monday",
        iconType: "calendar",
        iconBg: "bg-[#d8f8ef]",
        iconColor: "text-[#13ae87]"
    },
    {
        id: "2",
        time: "10:00 – 11:00",
        subject: "DBMS",
        room: "Room 102",
        professor: "Dr. Sharma",
        day: "Monday",
        iconType: "doc",
        iconBg: "bg-[#eee0ff]",
        iconColor: "text-[#8635dc]"
    },
    {
        id: "3",
        time: "11:00 – 11:30",
        subject: "Break",
        room: "Cafeteria",
        professor: "–",
        day: "Monday",
        iconType: "coffee",
        iconBg: "bg-[#fff0d6]",
        iconColor: "text-[#f4a321]"
    },
    {
        id: "4",
        time: "11:30 – 12:30",
        subject: "NLP",
        room: "Room 103",
        professor: "Prof. Alan",
        day: "Monday",
        iconType: "doc",
        iconBg: "bg-[#eee0ff]",
        iconColor: "text-[#8635dc]"
    },
    {
        id: "5",
        time: "12:30 – 01:00",
        subject: "Lunch",
        room: "Dining Hall",
        professor: "–",
        day: "Monday",
        iconType: "utensils",
        iconBg: "bg-[#e2eefc]",
        iconColor: "text-[#3970b7]"
    },
    {
        id: "6",
        time: "02:00 – 03:00",
        subject: "ML",
        room: "Room 104",
        professor: "Dr. Mehta",
        day: "Monday",
        iconType: "doc",
        iconBg: "bg-[#e2ecff]",
        iconColor: "text-[#2167d7]"
    },
    {
        id: "7",
        time: "03:00 – 04:00",
        subject: "Web Tech",
        room: "Lab 2",
        professor: "Dr. Mehta",
        day: "Monday",
        iconType: "laptop",
        iconBg: "bg-[#fff0d6]",
        iconColor: "text-[#f19b18]"
    }
];

// GET /api/student/timetable - Get daily and weekly schedule slots
export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const dayFilter = searchParams.get("day");

        const dashboard = getDashboardData();
        const upcomingClasses = dashboard.upcomingClasses || [];

        const sharedTimetable = dashboard.timetable || [];
        const sourceTimetable = sharedTimetable.length > 0 ? sharedTimetable : timetableData;
        const daySchedule = dayFilter
            ? sourceTimetable.filter((slot: any) => slot.day?.toLowerCase() === dayFilter.toLowerCase())
            : sourceTimetable;

        return NextResponse.json({
            success: true,
            day: dayFilter || "All",
            count: daySchedule.length,
            timetable: daySchedule,
            todayUpcoming: upcomingClasses
        }, { status: 200 });
    } catch (error) {
        console.error("Timetable GET Error:", error);
        return NextResponse.json({ error: "Failed to fetch timetable" }, { status: 500 });
    }
}

// POST /api/student/timetable - Add new class slot
export async function POST(req: Request) {
    try {
        const body = await req.json();
        if (!body.subject || !body.time) {
            return NextResponse.json({ error: "Subject and time are required" }, { status: 400 });
        }

        const newSlot = {
            id: Date.now().toString(),
            time: body.time,
            subject: body.subject,
            room: body.room || "Room 101",
            professor: body.professor || "Faculty",
            day: body.day || "Monday",
            iconType: body.iconType || "doc",
            iconBg: "bg-[#e2ecff]",
            iconColor: "text-[#2167d7]"
        };

        timetableData.push(newSlot);
        addUpcomingClass(newSlot);

        return NextResponse.json({ success: true, slot: newSlot }, { status: 201 });
    } catch (error) {
        console.error("Timetable POST Error:", error);
        return NextResponse.json({ error: "Failed to add timetable slot" }, { status: 500 });
    }
}

// DELETE /api/student/timetable - Delete class slot
export async function DELETE(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json({ error: "Slot ID is required" }, { status: 400 });
        }

        timetableData = timetableData.filter(s => s.id !== id);
        removeUpcomingClass(id);

        return NextResponse.json({ success: true, message: "Timetable slot deleted" }, { status: 200 });
    } catch (error) {
        console.error("Timetable DELETE Error:", error);
        return NextResponse.json({ error: "Failed to delete slot" }, { status: 500 });
    }
}

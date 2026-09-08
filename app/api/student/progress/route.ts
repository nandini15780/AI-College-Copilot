import { NextResponse } from "next/server";
import { getDashboardData, saveDashboardData, updateAssignment } from "@/lib/db";

// Dynamic default metrics
const defaultProgressMetrics = {
  overallGPA: 3.82,
  attendanceRate: 94,
  completedCredits: 112,
  totalCredits: 140,
  subjectProgress: [
    { id: "s1", subject: "Database Management Systems", code: "CS701", percentage: 88, grade: "A", totalTopics: 12, completedTopics: 10, instructor: "Dr. Sharma" },
    { id: "s2", subject: "Artificial Intelligence & ML", code: "CS702", percentage: 82, grade: "A-", totalTopics: 15, completedTopics: 12, instructor: "Prof. Alan" },
    { id: "s3", subject: "Machine Learning & Neural Nets", code: "CS703", percentage: 75, grade: "B+", totalTopics: 14, completedTopics: 10, instructor: "Dr. Mehta" },
    { id: "s4", subject: "Operating Systems", code: "CS704", percentage: 91, grade: "A+", totalTopics: 10, completedTopics: 9, instructor: "Prof. Vikram" },
    { id: "s5", subject: "Computer Networks & Protocols", code: "CS705", percentage: 79, grade: "B+", totalTopics: 12, completedTopics: 9, instructor: "Dr. Rao" },
    { id: "s6", subject: "Full Stack Web Development", code: "CS706", percentage: 95, grade: "A+", totalTopics: 10, completedTopics: 9, instructor: "Prof. Ananya" }
  ],
  recentTestScores: [
    { id: "t1", test: "DBMS Mid-Term Exam", subject: "DBMS", score: 92, maxScore: 100, date: "2025-08-20", grade: "A" },
    { id: "t2", test: "AI Lab Evaluation 1", subject: "Artificial Intelligence", score: 45, maxScore: 50, date: "2025-08-25", grade: "A" },
    { id: "t3", test: "OS Quiz 2 - Memory & Deadlocks", subject: "Operating Systems", score: 18, maxScore: 20, date: "2025-09-01", grade: "A+" },
    { id: "t4", test: "ML Coding Assignment Test", subject: "Machine Learning", score: 88, maxScore: 100, date: "2025-09-04", grade: "B+" },
    { id: "t5", test: "Computer Networks Quiz 1", subject: "Computer Networks", score: 40, maxScore: 50, date: "2025-09-06", grade: "B" }
  ],
  recentActivity: [
    { id: "a1", type: "submission", title: "Machine Learning Assignment", status: "Submitted", timeAgo: "2 days ago", subject: "ML" },
    { id: "a2", type: "view", title: "DBMS Mini Project Docs", status: "Viewed", timeAgo: "3 days ago", subject: "DBMS" },
    { id: "a3", type: "overdue", title: "NLP Research Paper", status: "Overdue", timeAgo: "1 day ago", subject: "AI" },
    { id: "a4", type: "completion", title: "Web Development Project", status: "Completed", timeAgo: "4 days ago", subject: "Web Dev" }
  ]
};

export async function GET() {
  try {
    const dashboard = getDashboardData();
    const assignments = dashboard.assignments || [];

    const completedCount = assignments.filter((a: any) =>
      ["Completed", "Submitted"].includes(a.status)
    ).length;

    const inProgressCount = assignments.filter((a: any) =>
      a.status === "In Progress"
    ).length;

    const pendingCount = assignments.length - completedCount;

    // Calculate dynamic progress percentage
    const calcPercentage = assignments.length > 0
      ? Math.round((completedCount / assignments.length) * 100)
      : 78;

    return NextResponse.json(
      {
        success: true,
        summary: {
          progressPercentage: calcPercentage,
          overallGPA: defaultProgressMetrics.overallGPA,
          attendanceRate: defaultProgressMetrics.attendanceRate,
          completedCredits: defaultProgressMetrics.completedCredits,
          totalCredits: defaultProgressMetrics.totalCredits,
        },
        completedAssignments: completedCount,
        inProgressAssignments: inProgressCount,
        pendingAssignments: pendingCount,
        totalAssignments: assignments.length,
        assignments: assignments,
        subjectProgress: defaultProgressMetrics.subjectProgress,
        recentTestScores: defaultProgressMetrics.recentTestScores,
        recentActivity: defaultProgressMetrics.recentActivity,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Progress GET Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch progress metrics" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const dashboard = getDashboardData();

    if (body.action === "updateSubjectProgress" && body.subjectId) {
      const subjectIndex = defaultProgressMetrics.subjectProgress.findIndex(
        (s) => s.id === body.subjectId
      );
      if (subjectIndex !== -1) {
        defaultProgressMetrics.subjectProgress[subjectIndex].percentage =
          Math.min(100, Math.max(0, body.percentage));
        if (body.completedTopics !== undefined) {
          defaultProgressMetrics.subjectProgress[subjectIndex].completedTopics =
            body.completedTopics;
        }
      }
    } else if (body.action === "updateAssignmentStatus" && body.assignmentId) {
      const updatedAssignments = (dashboard.assignments || []).map((a: any) => {
        if (a.id === body.assignmentId) {
          return {
            ...a,
            status: body.status,
            category: body.status === "Submitted" ? "Submitted" : a.category,
          };
        }
        return a;
      });
      dashboard.assignments = updatedAssignments;
      saveDashboardData(dashboard);
    }

    return NextResponse.json({
      success: true,
      message: "Progress updated successfully",
    });
  } catch (error) {
    console.error("Progress PATCH Error:", error);
    return NextResponse.json(
      { error: "Failed to update progress" },
      { status: 500 }
    );
  }
}

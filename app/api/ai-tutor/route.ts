export const dynamic = "force-dynamic";

import { GET as studentGET, POST as studentPOST, DELETE as studentDELETE } from "@/app/api/student/ai-tutor/route";

export async function GET(req: Request) {
    return studentGET(req);
}

export async function POST(req: Request) {
    return studentPOST(req);
}

export async function DELETE(req: Request) {
    return studentDELETE(req);
}


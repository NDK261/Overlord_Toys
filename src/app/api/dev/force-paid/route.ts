import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("orders")
    .update({ status: "paid" })
    .eq("status", "pending")
    .select();

  return NextResponse.json({ updated: data?.length, error, data });
}

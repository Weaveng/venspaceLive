import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { refreshToken } = await req.json();

  const client_id = process.env.ZOHO_CLIENT_ID!;
  const client_secret = process.env.ZOHO_CLIENT_SECRET!;

  if (!refreshToken || !client_id || !client_secret) {
    return NextResponse.json({ error: "Missing credentials" }, { status: 400 });
  }

  try {
    const params = new URLSearchParams();
    params.append("refresh_token", refreshToken);
    params.append("client_id", client_id);
    params.append("client_secret", client_secret);
    params.append("grant_type", "refresh_token");

    const zohoRes = await fetch("https://accounts.zoho.com/oauth/v2/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });

    if (!zohoRes.ok) {
      const err = await zohoRes.text();
      return NextResponse.json({ error: "Zoho token error", details: err }, { status: 500 });
    }

    const data = await zohoRes.json();
    return NextResponse.json({ accessToken: data.access_token });
  } catch (err) {
    console.error("Token refresh failed:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

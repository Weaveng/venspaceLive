import { NextResponse } from "next/server";

const CLIENT_ID = "1000.ZRZB7LLDOS0KUBX2CRA68IOEXU0T6O";
const CLIENT_SECRET = "666b8183c6a6562f7d9ad81ffa0aaa185046b85309";
const LIST_KEY = "3zd4a725ceef889a6c59f182164a0dd0288fc5f2396370618d3e0bcef414e22714";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, phone, description } = body;

    // 1. Get access token from Zoho
    const tokenRes = await fetch("https://accounts.zoho.com/oauth/v2/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        refresh_token: "YOUR_REFRESH_TOKEN",
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        grant_type: "refresh_token",
      }),
    });

    const tokenData = await tokenRes.json();
    const accessToken = tokenData.access_token;

    // 2. Add subscriber to Zoho Campaigns
    const subscribeRes = await fetch(
      `https://campaigns.zoho.com/api/v1.1/addlistsubscriber?listkey=${LIST_KEY}&resfmt=JSON`,
      {
        method: "POST",
        headers: {
          Authorization: `Zoho-oauthtoken ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contactinfo: {
            FirstName: description,
            Email: email,
            ContactNumber: phone,
          },
        }),
      }
    );

    const subscribeData = await subscribeRes.json();
    return NextResponse.json({ success: true, data: subscribeData });
  } catch (err) {
    console.error("Zoho error:", err);
    return NextResponse.json({ success: false, error: "Zoho integration failed" }, { status: 500 });
  }
}

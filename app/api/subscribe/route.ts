import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { email, phone, description } = await req.json();

  const listKey = process.env.ZOHO_LIST_KEY!;
  const refreshToken = process.env.ZOHO_REFRESH_TOKEN!;

  try {
    // 1. Fetch access token
    const tokenRes = await fetch("http://localhost:3000/api/refresh-token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });

    if (!tokenRes.ok) throw new Error("Unable to get Zoho access token");
    const { accessToken } = await tokenRes.json();

    // 2. Post data to Zoho Campaigns
    const res = await fetch(
      `https://campaigns.zoho.com/api/v1.1/addlistsubscribersinbulk?listkey=${listKey}&resfmt=JSON`,
      {
        method: "POST",
        headers: {
          Authorization: `Zoho-oauthtoken ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contactinfo: [
            {
              ContactEmail: email,
              Phone: phone,
              CustomField1: description,
            },
          ],
        }),
      }
    );

    const result = await res.json();
    return NextResponse.json(result);
  } catch (err) {
    console.error("Zoho subscription error:", err);
    return NextResponse.json({ error: "Subscription failed" }, { status: 500 });
  }
}




// // app/api/subscribe/route.ts
// import { NextRequest, NextResponse } from "next/server";

// export async function POST(req: NextRequest) {
//   try {
//     const { email, firstName, lastName } = await req.json();

//     const ZOHO_ACCESS_TOKEN = process.env.NEXT_PUBLIC_ZOHO_ACCESS_TOKEN as string;
//     const LIST_KEY = process.env.NEXT_PUBLIC_ZOHO_LIST_KEY as string;

//     console.log(LIST_KEY, ZOHO_ACCESS_TOKEN)

//     if (!ZOHO_ACCESS_TOKEN || !LIST_KEY) {
//       return NextResponse.json({ success: false, error: "Missing credentials" }, { status: 500 });
//     }

//     const contactinfo = {
//       "First Name": firstName || "",
//       "Last Name": lastName || "",
//       "Contact Email": email,
//     };

//     const url = `https://campaigns.zoho.com/api/v1.1/json/listsubscribe`;

//     const params = new URLSearchParams({
//       resfmt: "JSON",
//       listkey: LIST_KEY,
//       contactinfo: JSON.stringify(contactinfo),
//       source: "NextApp",
//     });

//     const response = await fetch(`${url}?${params}`, {
//       method: "POST",
//       headers: {
//         Authorization: `Zoho-oauthtoken ${ZOHO_ACCESS_TOKEN}`,
//         "Content-Type": "application/x-www-form-urlencoded",
//       },
//     });

//     const data = await response.json();

//     if (data.status === "success") {
//       return NextResponse.json({ success: true, message: data.message });
//     } else {
//       return NextResponse.json({ success: false, error: data.message || "Unknown error" }, { status: 400 });
//     }
//   } catch (err) {
//     return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
//   }
// }


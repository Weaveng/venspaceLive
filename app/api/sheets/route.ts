import { google } from "googleapis";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
  const privateKeyRaw = process.env.GOOGLE_PRIVATE_KEY;
  const sheetId = process.env.GOOGLE_SHEET_ID;

  const missing = [
    !clientEmail && "GOOGLE_CLIENT_EMAIL",
    !privateKeyRaw && "GOOGLE_PRIVATE_KEY",
    !sheetId && "GOOGLE_SHEET_ID",
  ].filter(Boolean) as string[];

  if (missing.length > 0) {
    return NextResponse.json(
      {
        success: false,
        error: `Missing environment variables: ${missing.join(", ")}`,
      },
      { status: 500 }
    );
  }

  const privateKey = privateKeyRaw!.replace(/\\n/g, "\n");

  if (!clientEmail!.includes("@") || !privateKey.includes("BEGIN PRIVATE KEY")) {
    return NextResponse.json(
      { success: false, error: "Invalid Google API credentials" },
      { status: 500 }
    );
  }

  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: clientEmail,
        private_key: privateKey,
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const sheets = google.sheets({ version: "v4", auth });

    const body = await request.json();
    const { email, phone, description, testerProgram } = body;

    // First, get all existing values from the sheet
    const readResponse = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: "Sheet1!A:D", // Assuming columns A (email), B (phone), C (description), D (testerProgram)
    });

    const existingValues = readResponse.data.values || [];

    // Check if email or phone already exists
    const emailExists = existingValues.some(row => row[0] === email);
    const phoneExists = existingValues.some(row => row[1] === phone);

    if (emailExists || phoneExists) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Entry already exists",
          details: {
            emailExists,
            phoneExists,
            message: emailExists 
            ? "This email is already registered" 
            : "This phone number is already registered"
          }
        }, 
        { status: 400 }
      );
    }

    // If email and phone don't exist, append the new row
    const appendResponse = await sheets.spreadsheets.values.append({
      spreadsheetId: sheetId,
      range: "Sheet1!A:D",
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [[email, phone, description, testerProgram]],
      },
    });

    return NextResponse.json({
      success: true,
      data: appendResponse.data
    });
  } catch (error) {
    console.error("Error processing sheet data:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process sheet data" },
      { status: 500 }
    );
  }
}
import { NextRequest, NextResponse } from "next/server";
import { generateObject } from "ai";
import { z } from "zod";
import { createAnthropic } from "@ai-sdk/anthropic";

const transactionSchema = z.object({
  date: z.string().describe("The transaction date in MM/DD/YYYY format"),
  description: z.string().describe("The merchant or transaction description"),
  amount: z.number().describe("The transaction amount as a number"),
  category: z
    .string()
    .describe("The transaction category like 'Travel', 'Food', 'Office'"),
});

const statementSchema = z.object({
  statementPeriod: z
    .string()
    .describe("The statement period (e.g., 'January 1 - January 31, 2025')"),
  bankName: z
    .string()
    .describe("The bank name (e.g., 'Chase', 'Bank of America')"),
  cardName: z
    .string()
    .describe(
      "The credit card name (e.g., 'Freedom Unlimited', 'Sapphire Preferred')"
    ),
  transactions: z.array(transactionSchema).describe("The list of transactions"),
});

// Create a configured Anthropic provider
const anthropicProvider = createAnthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || "",
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Read file content

    // Generate structured data from the statement using AI
    const { object } = await generateObject({
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Extract credit card statement details from the following text. Identify the statement period, bank name, card name, and list of transactions with dates, descriptions, amounts, and appropriate categories:",
            },
            {
              type: "file",
              data: await file.arrayBuffer(),
              mimeType: "application/pdf",
            },
          ],
        },
      ],
      schema: statementSchema,
      temperature: 0.2,
      model: anthropicProvider("claude-3-5-sonnet-20241022"),
    });

    return NextResponse.json(object);
  } catch (error) {
    console.error("Error processing statement:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Error processing statement",
      },
      { status: 500 }
    );
  }
}

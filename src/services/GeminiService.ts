import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(API_KEY);

export interface ParsedBillData {
  billingPeriod: string;
  totalDue: string;
  consumption: string;
  tariff: string;
  peakHours: string;
  totalUnits: string;
  previousMonthUnits: string;
  breakdown: {
    energyCharge: string;
    fixedCharges: string;
    fuelAdjustment: string;
    electricityDuty: string;
    meterRent: string;
    previousArrears: string;
    subsidyAdjustment: string;
    netBillAmount: string;
  };
}

export interface AdviceInput {
  locationLabel: string;
  weatherSummary: string;
  appliancesSummary: string;
  tariffSummary?: string;
  unitsSummary?: string;
}

export const analyzeBill = async (base64Image: string): Promise<ParsedBillData> => {
  if (!API_KEY) {
    throw new Error("Gemini API key is not configured. Please add EXPO_PUBLIC_GEMINI_API_KEY to your .env file.");
  }

  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `
    You are an expert utility bill parser. Analyze this uploaded electricity bill.
    Extract the following details and return the output STRICTLY as a JSON document with no markdown formatting.
    The keys MUST exactly match the following structure and values should be strings formatted properly (e.g. currency mapping, adding units if relevant):

    {
      "billingPeriod": "extracted billing period like 'Oct 01 - Oct 31, 2023' or 'N/A'",
      "totalDue": "Total amount due as string, e.g. '$142.50' or 'Rs. 5000'",
      "consumption": "Total consumption in kWh as string, e.g. '842 kWh'",
      "tariff": "Tariff type, e.g. 'Domestic LT-1' or 'A-1'",
      "peakHours": "Peak hour units or charges if found, else 'N/A'",
      "totalUnits": "Total units consumed this month",
      "previousMonthUnits": "Previous month units if listed, else 'N/A'",
      "breakdown": {
        "energyCharge": "Amount, e.g. '$92.62'",
        "fixedCharges": "Amount, e.g. '$18.00'",
        "fuelAdjustment": "Amount, e.g. '$9.45'",
        "electricityDuty": "Amount, e.g. '$12.32'",
        "meterRent": "Amount, e.g. '$3.50'",
        "previousArrears": "Amount, e.g. '$8.00'",
        "subsidyAdjustment": "Amount, e.g. '-$1.39'",
        "netBillAmount": "Final amount, e.g. '$142.50'"
      }
    }

    Respond ONLY with raw JSON. Don't wrap in \`\`\`json.
  `;

  const imagePart = {
    inlineData: {
      data: base64Image,
      mimeType: "image/jpeg",
    },
  };

  try {
    const result = await model.generateContent([prompt, imagePart]);
    const responseText = result.response.text().trim();

    // Attempt to handle if markdown block was mistakenly added
    let jsonStr = responseText;
    if (jsonStr.startsWith('```json')) {
      jsonStr = jsonStr.substring(7);
    }
    if (jsonStr.startsWith('```')) {
      jsonStr = jsonStr.substring(3);
    }
    if (jsonStr.endsWith('```')) {
      jsonStr = jsonStr.substring(0, jsonStr.length - 3);
    }

    return JSON.parse(jsonStr.trim()) as ParsedBillData;
  } catch (error) {
    console.error("Error analyzing bill with Gemini:", error);
    throw new Error("Failed to parse bill. Please check the image and your API key.");
  }
};

export const generateEnergySavingAdvice = async (input: AdviceInput): Promise<string> => {
  if (!API_KEY) {
    throw new Error("Gemini API key is not configured. Please add EXPO_PUBLIC_GEMINI_API_KEY to your .env file.");
  }

  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `
    You are Bijli Buddy's electricity optimization assistant for Pakistan users.
    Generate practical and realistic savings advice based on weather and home appliance usage.

    User context:
    - Location: ${input.locationLabel}
    - Weather: ${input.weatherSummary}
    - Appliances: ${input.appliancesSummary}
    - Latest tariff: ${input.tariffSummary || "Not available"}
    - Latest monthly units: ${input.unitsSummary || "Not available"}

    Output rules:
    - Keep language simple and direct.
    - Focus on actions that reduce electricity bill in the given weather.
    - Mention AC/fan/fridge/water-heating adjustments when relevant.
    - Include 5 to 7 bullet points.
    - Add one short "Priority today" line at the end.
    - Return plain text only (no markdown code blocks).
  `;

  try {
    const result = await model.generateContent(prompt);
    return result.response.text().trim();
  } catch (error) {
    console.error("Error generating energy advice with Gemini:", error);
    throw new Error("Failed to generate AI advice. Please try again.");
  }
};

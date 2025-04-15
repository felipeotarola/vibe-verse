import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Get the API key from environment variables
const apiKey = process.env.GOOGLE_API_KEY;

if (!apiKey) {
  console.error('Error: GOOGLE_API_KEY environment variable is not set.');
  // Optionally throw an error or return a specific response if the key is missing during startup
  // For now, we'll let the request fail later if the key is missing
}

// Initialize the Google Generative AI client
const genAI = new GoogleGenerativeAI(apiKey || ''); // Use apiKey or empty string if not found initially
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' }); // Or use 'gemini-pro'

export async function POST(req: NextRequest) {
  // Ensure the API key is available before proceeding with the request
  if (!apiKey) {
    return new NextResponse(JSON.stringify({ error: 'Google AI API key is not configured on the server.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const { name, category } = await req.json();

    if (!name || !category) {
      return new NextResponse(JSON.stringify({ error: 'Missing name or category' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const prompt = `
      Generate a compelling project description for a project named "${name}" in the category of "${category}".
      Follow this format strictly:
      - **Start with a bold, attention-grabbing one-liner about the project.**
      - Briefly overview the project's purpose and core features.
      - Describe the tech stack used (you can make educated guesses or use common stacks for the category).
      - End with a call to action (e.g., visit the project URL or GitHub repo if provided, otherwise a general encouragement to check it out).
      Make sure the output is just the description text, without any preamble or extra formatting like markdown code blocks.
    `;

    console.log('Sending prompt to Google AI:', prompt); // Log the prompt for debugging

    // Call the Google AI model
    const result = await model.generateContent(prompt);
    const response = result.response; // Access the response object directly
    const aiDescription = response.text(); // Get the generated text

    if (!aiDescription) {
      console.error('AI model returned an empty or invalid response:', response);
      throw new Error('AI model failed to generate a description.');
    }

    console.log('Received AI Description:', aiDescription); // Log the response

    // Send the AI-generated description back
    return new NextResponse(JSON.stringify({ description: aiDescription }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('Error generating project description with Google AI:', error);
    // Check for specific Google AI API errors if needed
    // if (error.response && error.response.data) { ... }
    return new NextResponse(JSON.stringify({ error: error.message || 'An error occurred while generating the description.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

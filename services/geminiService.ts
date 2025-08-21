
import { GoogleGenAI, Type } from "@google/genai";
import { Book } from '../types';

if (!process.env.API_KEY) {
  console.warn("API_KEY environment variable not set. Gemini features will be disabled.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

const recommendationSchema = {
  type: Type.OBJECT,
  properties: {
    recommendations: {
      type: Type.ARRAY,
      description: "An array of book titles recommended for the user.",
      items: {
        type: Type.STRING,
        description: "The title of a recommended book, must match a title from the provided list of available books.",
      }
    }
  },
  required: ["recommendations"],
};

export async function getPersonalizedRecommendations(
  borrowingHistory: Book[],
  allAvailableBooks: Book[]
): Promise<string[]> {
  if (!process.env.API_KEY) {
    // Return a random subset if API key is not available
    return allAvailableBooks
      .sort(() => 0.5 - Math.random())
      .slice(0, 3)
      .map(b => b.title);
  }

  const historyTitles = borrowingHistory.map(b => b.title).join(', ');
  const availableBookList = allAvailableBooks
    .map(b => `- "${b.title}" by ${b.author} (Genre: ${b.genre})`)
    .join('\n');

  const prompt = `
    You are a book recommendation engine for a community library app called "The Book Nook".
    Based on the user's borrowing history and the list of currently available books, recommend up to 4 books.

    User's Borrowing History (books they've read and likely enjoyed):
    ${historyTitles.length > 0 ? historyTitles : "This is a new user with no borrowing history."}

    List of all available books in the community:
    ${availableBookList}

    Analyze the themes, genres, and authors from the user's history and select the best matches from the list of available books.
    If the user is new, recommend a diverse selection of popular titles from different genres.
    Return ONLY a JSON object that adheres to the provided schema. The titles in the 'recommendations' array must exactly match titles from the "available books" list.
    Do not include books the user has already read in your recommendations.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: recommendationSchema,
      },
    });

    const jsonString = response.text.trim();
    const parsedResult = JSON.parse(jsonString);

    if (parsedResult && parsedResult.recommendations) {
      return parsedResult.recommendations;
    }
    return [];
  } catch (error) {
    console.error("Error fetching recommendations from Gemini:", error);
    // Fallback to random recommendations on API error
    return allAvailableBooks
      .sort(() => 0.5 - Math.random())
      .slice(0, 3)
      .map(b => b.title);
  }
}

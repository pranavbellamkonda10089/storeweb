
import { GoogleGenAI, Chat } from "@google/genai";
import { Product } from "../types";

// Always use the named parameter and obtain API key directly from process.env.API_KEY
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getProductAnalysis = async (product: Product, query: string): Promise<string> => {
  try {
    // Using gemini-3-flash-preview for basic text tasks as per guidelines
    const model = 'gemini-3-flash-preview';
    const response = await ai.models.generateContent({
      model: model,
      contents: `User Question: ${query}`,
      config: {
        systemInstruction: `
          You are an expert StoreWeb product assistant. 
          Product Details:
          Title: ${product.title}
          Description: ${product.description}
          Price: ₹${product.price}
          Category: ${product.category}
          
          Answer the user's question concisely based on the product details provided. If the answer isn't in the details, make a reasonable inference or state you don't know, but remain helpful and sales-oriented.
        `,
      },
    });

    // Use .text property to get the string content
    return response.text || "I couldn't generate a response at this time.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Sorry, I'm having trouble connecting to the AI assistant right now.";
  }
};

export const summarizeReviews = async (reviews: string[]): Promise<string> => {
  try {
     const model = 'gemini-3-flash-preview';
     const response = await ai.models.generateContent({
       model: model,
       contents: `Summarize these reviews:\n${reviews.join('\n---\n')}`,
       config: {
         systemInstruction: "Please provide a concise summary of the pros and cons based on these reviews. Bullet points are preferred.",
       },
     });

     return response.text || "Could not summarize reviews.";
  } catch (error) {
    return "Unavailable to summarize at this moment.";
  }
}

export const createChatSession = (contextData: string): Chat => {
  // Use gemini-3-flash-preview for general support tasks
  return ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: `
        You are StoreWeb's advanced AI customer support agent.
        You are helpful, polite, concise, and professional.
        
        You have access to the following context data in JSON format:
        ${contextData}
        
        YOUR RESPONSIBILITIES:
        1. Answer questions about products in the catalog (price, features, etc.). Prices are in Rupees (₹).
        2. Check order status for the user based on the 'recentOrders' list.
        3. Assist with cart contents.
        4. If a user asks about an order ID that exists in 'recentOrders', provide its status and details.
        5. If the user asks "Where is my order?", ask them for the Order ID or list their recent orders if available.
        6. If a user asks about reviews for a specific product, look up the 'productReviews' using the product's ID (which you can find by matching the product name in 'productCatalog'). Summarize the customer sentiment, ratings, and pros/cons based on those reviews.
        
        Keep answers short and easy to read.
      `,
    },
  });
};

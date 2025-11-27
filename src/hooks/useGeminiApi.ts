
import { useState } from 'react';

interface PlantIdentificationResult {
  name: string;
  scientificName: string;
  confidence: number;
  description?: string;
  nativeRegion?: string;
  commonUses?: string;
  lightRequirements?: string;
  wateringNeeds?: string;
  temperatureRange?: string;
  additionalTips?: string[];
  careInfo?: string;
  imageSource?: string;
}

export const useGeminiApi = () => {
  // Prefer env key if provided, else empty until loaded from localStorage
  const envApiKey = (import.meta as any).env?.VITE_GEMINI_API_KEY as string | undefined;
  const [apiKey, setApiKey] = useState<string>(envApiKey || '');
  const [cooldownUntilMs, setCooldownUntilMs] = useState<number>(0);

  // Function to identify plant based on text description
  const identifyPlantWithText = async (description: string): Promise<PlantIdentificationResult> => {
    if (!apiKey) {
      const savedKey = localStorage.getItem('gemini_api_key');
      if (savedKey) {
        setApiKey(savedKey);
      } else if (envApiKey) {
        setApiKey(envApiKey);
      } else {
        throw new Error('API key not configured');
      }
    }

    try {
      await ensureNotInCooldown();
      const response = await callGeminiApi({
        prompt: `Based on this plant description, identify the most likely plant species. Description: ${description}.
        Return the response as a JSON object with the following structure:
        {
          "name": "Common name of the plant",
          "scientificName": "Scientific name of the plant",
          "confidence": 0.XX (a number between 0 and 1 indicating confidence),
          "description": "A short description of the plant",
          "nativeRegion": "Geographic origin of the plant",
          "commonUses": "List primary uses separated by commas",
          "lightRequirements": "Specific light needs",
          "wateringNeeds": "Frequency and conditions",
          "temperatureRange": "Temperature in both Celsius and Fahrenheit",
          "additionalTips": ["Tip 1", "Tip 2", "Tip 3"],
          "careInfo": "Brief care instructions for the plant"
        }

        Make sure to include all fields in the response, even if you need to make an educated guess based on typical characteristics of the plant species.`
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error.message || 'Failed to identify plant');
      }

      // Parse the response text as JSON
      const textResponse = data.candidates[0]?.content?.parts?.[0]?.text;
      if (!textResponse) {
        throw new Error('Invalid response from API');
      }

      // Extract the JSON part from the text response
      let jsonMatch = textResponse.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Could not parse plant data from response');
      }

      const plantData = JSON.parse(jsonMatch[0]);

      return {
        name: plantData.name,
        scientificName: plantData.scientificName || "Unknown",
        confidence: plantData.confidence || 0.7,
        description: plantData.description,
        nativeRegion: plantData.nativeRegion,
        commonUses: plantData.commonUses,
        lightRequirements: plantData.lightRequirements,
        wateringNeeds: plantData.wateringNeeds,
        temperatureRange: plantData.temperatureRange,
        additionalTips: plantData.additionalTips || [],
        careInfo: plantData.careInfo,
        imageSource: "text"
      };
    } catch (error) {
      console.error('Error identifying plant with text:', error);
      throw error;
    }
  };

  // Function to identify plant based on image
  const identifyPlantWithImage = async (image: File): Promise<PlantIdentificationResult> => {
    if (!apiKey) {
      const savedKey = localStorage.getItem('gemini_api_key');
      if (savedKey) {
        setApiKey(savedKey);
      } else if (envApiKey) {
        setApiKey(envApiKey);
      } else {
        throw new Error('API key not configured');
      }
    }

    try {
      await ensureNotInCooldown();
      // Convert the image to base64
      const base64Image = await fileToBase64(image);

      const response = await callGeminiApi({
        prompt: `Identify this plant in the image. Return the response as a JSON object with the following structure:
        {
          "name": "Common name of the plant",
          "scientificName": "Scientific name of the plant",
          "confidence": 0.XX (a number between 0 and 1 indicating confidence),
          "description": "A short description of the plant",
          "nativeRegion": "Geographic origin of the plant",
          "commonUses": "List primary uses separated by commas",
          "lightRequirements": "Specific light needs",
          "wateringNeeds": "Frequency and conditions",
          "temperatureRange": "Temperature in both Celsius and Fahrenheit",
          "additionalTips": ["Tip 1", "Tip 2", "Tip 3"],
          "careInfo": "Brief care instructions for the plant"
        }

        Make sure to include all fields in the response, even if you need to make an educated guess based on typical characteristics of the plant species.`,
        image: { mimeType: image.type, base64Data: base64Image.split(',')[1] }
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error.message || 'Failed to identify plant');
      }

      // Parse the response text as JSON
      const textResponse = data.candidates[0]?.content?.parts?.[0]?.text;
      if (!textResponse) {
        throw new Error('Invalid response from API');
      }

      // Extract the JSON part from the text response
      let jsonMatch = textResponse.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Could not parse plant data from response');
      }

      const plantData = JSON.parse(jsonMatch[0]);

      return {
        name: plantData.name,
        scientificName: plantData.scientificName || "Unknown",
        confidence: plantData.confidence || 0.85,
        description: plantData.description,
        nativeRegion: plantData.nativeRegion,
        commonUses: plantData.commonUses,
        lightRequirements: plantData.lightRequirements,
        wateringNeeds: plantData.wateringNeeds,
        temperatureRange: plantData.temperatureRange,
        additionalTips: plantData.additionalTips || [],
        careInfo: plantData.careInfo,
        imageSource: "upload"
      };
    } catch (error) {
      console.error('Error identifying plant with image:', error);
      throw error;
    }
  };

  // Function to configure API key
  const setGeminiApiKey = (key: string) => {
    setApiKey(key);
    return true;
  };

  // Centralized API caller with basic retry/backoff on 429
  const callGeminiApi = async ({ prompt, image }: { prompt: string; image?: { mimeType: string; base64Data: string } }) => {
    const effectiveKey = apiKey || envApiKey;
    if (!effectiveKey || /your_gemini_api_key_here/i.test(effectiveKey)) {
      throw new Error('API key not configured. Add a valid VITE_GEMINI_API_KEY in .env.local or set it via Configure API Key.');
    }

    const body: any = {
      contents: [{
        parts: [
          { text: prompt },
        ]
      }]
    };
    if (image) {
      body.contents[0].parts.push({
        inline_data: {
          mime_type: image.mimeType,
          data: image.base64Data,
        }
      });
    }

    let attempt = 0;
    const maxAttempts = 3;
    let lastError: any = null;
    while (attempt < maxAttempts) {
      let response: Response;
      try {
        response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${effectiveKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        });
      } catch (networkError: any) {
        throw new Error('Network error reaching Gemini API. Check your internet connection and try again.');
      }

      if (response.status === 429) {
        // Rate limited: set a short cooldown and retry with exponential backoff
        const retryAfterHeader = response.headers.get('retry-after');
        const retryAfterMs = retryAfterHeader ? Number(retryAfterHeader) * 1000 : Math.pow(2, attempt) * 1000 + 1000;
        setCooldownUntilMs(Date.now() + retryAfterMs);
        await sleep(retryAfterMs);
        attempt += 1;
        continue;
      }

      if (!response.ok) {
        const parsed = await safeParseError(response);
        lastError = parsed;
        if (response.status === 401) {
          throw new Error('Unauthorized: Invalid API key. Replace VITE_GEMINI_API_KEY with a valid key.');
        }
        if (response.status === 403) {
          throw new Error(parsed.message || 'Forbidden: Quota exceeded or access denied for this project/key.');
        }
        // For other non-OK statuses, stop retrying
        break;
      }

      return response;
    }

    if (lastError?.message) {
      throw new Error(lastError.message);
    }
    throw new Error('Failed to call Gemini API');
  };

  const ensureNotInCooldown = async () => {
    const now = Date.now();
    if (cooldownUntilMs > now) {
      const waitMs = cooldownUntilMs - now;
      await sleep(waitMs);
    }
  };

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const safeParseError = async (response: Response) => {
    try {
      const data = await response.json();
      return data.error || { message: `Request failed with status ${response.status}` };
    } catch {
      return { message: `Request failed with status ${response.status}` };
    }
  };

  // Helper function to convert File to base64 string
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  return {
    identifyPlantWithText,
    identifyPlantWithImage,
    setGeminiApiKey
  };
};

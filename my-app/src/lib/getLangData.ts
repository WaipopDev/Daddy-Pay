import axios from "axios"

// lib/getLangData.ts
export async function getLangData(langCode: string, token: string): Promise<Record<string, string>> {
  try {
    const response = await axios.get(`${process.env.API_URL}/api/v1/language?labgCode=${langCode}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response.status === 200) {
      return response.data
    } else {
      console.error('Error fetching language data:', response.statusText)
      return {}
    }
  } catch (e) {
    console.error('getLangData error:', e)
    return {}
  }
}
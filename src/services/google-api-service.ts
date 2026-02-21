import { PlacePrediction } from '../types/places';

class GoogleApiService {
  private static get apiKey() {
    return process.env.EXPO_PUBLIC_GOOGLE_API_KEY;
  }

  static async fetchPredictions(input: string) {
    if (!input.trim() || !this.apiKey) {
      return [];
    }
    try {
      const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(input)}&types=(cities)&key=${this.apiKey}`;
      const res = await fetch(url);
      const data = (await res.json()) as {
        predictions?: Array<{
          place_id: string;
          description: string;
          structured_formatting?: { main_text: string };
        }>;
      };

      const list: PlacePrediction[] = (data.predictions ?? []).map((p) => ({
        place_id: p.place_id,
        description: p.description,
        main_text: p.structured_formatting?.main_text ?? p.description,
      }));
      return list;
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  static async fetchPlaceDetails(placeId: string) {
    if (!this.apiKey) return;

    try {
      const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=address_components,name&key=${this.apiKey}`;
      const res = await fetch(url);
      const data = (await res.json()) as {
        result?: {
          address_components?: Array<{
            types: string[];
            short_name: string;
            long_name: string;
          }>;
          name?: string;
        };
      };

      const components = data.result?.address_components ?? [];
      let cityName = data.result?.name ?? '';
      let countryCode = '';

      for (const c of components) {
        if (c.types.includes('country')) {
          countryCode = c.short_name.toLowerCase();
        }
        if (c.types.includes('locality')) {
          cityName = c.long_name;
        }
        if (!cityName && c.types.includes('administrative_area_level_1')) {
          cityName = c.long_name;
        }
      }

      if (cityName && countryCode) {
        return { cityName, countryCode };
      }
    } catch {
      return null;
    }
  }
}

export default GoogleApiService;

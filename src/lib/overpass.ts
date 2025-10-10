import { Pub } from '@/types';

export async function fetchNearbyPubs(lat: number, lon: number, radius: number = 1000): Promise<Pub[]> {
  const query = `
    [out:json];
    (
      node["amenity"="pub"](around:${radius},${lat},${lon});
      node["amenity"="bar"](around:${radius},${lat},${lon});
    );
    out body;
  `;

  try {
    const response = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      body: query,
    });

    if (!response.ok) {
      throw new Error('Failed to fetch pubs from Overpass API');
    }

    const data = await response.json();
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return data.elements.map((element: any, index: number) => ({
      id: element.id || index,
      name: element.tags?.name || 'Unnamed Pub',
      lat: element.lat,
      lon: element.lon,
      address: element.tags?.['addr:street'] 
        ? `${element.tags['addr:housenumber'] || ''} ${element.tags['addr:street']}`.trim()
        : undefined,
    }));
  } catch (error) {
    console.error('Error fetching pubs:', error);
    return [];
  }
}

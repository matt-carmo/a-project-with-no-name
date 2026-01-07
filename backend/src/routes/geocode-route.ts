import { FastifyInstance } from 'fastify';
type NominatimResult = {
  lat: string;
  lon: string;
  display_name: string;
  address?: {
    road?: string;
    suburb?: string;       
    city?: string;
    state?: string;
    postcode?: string; 
  };
};

async function fetchGeocodeData(q: string) {
  const response = await fetch(
    `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
      `${q} Presidente Prudente SP`
    )}&format=json&limit=5&addressdetails=1`,
    {
      headers: {
        "User-Agent": "a-project-with-no-name/1.0 (matheus2018i@gmail.com)"
      }
    }
  );

  if (!response.ok) {
    const text = await response.text();
    console.error("Nominatim error:", response.status, text);
    throw new Error("Erro ao consultar geocode");
  }

  const data = (await response.json()) as NominatimResult[];

  return data.map(item => ({
    displayName: `${item.address?.road ?? ''}, ${item.address?.suburb ?? ''}`,
    lat: Number(item.lat),
    lon: Number(item.lon),

    road: item.address?.road ?? '',
    district: item.address?.suburb ?? '',
    city: item.address?.city ?? '',
    state: item.address?.state ?? '',
    zipCode: item.address?.postcode ?? '',
  }));
}


export async function GeocodeRoutes(server: FastifyInstance) {
  server.get('/geocode', {

    config: { public: true },
    
    handler: async (request, reply) => {
      const { q } = request.query as { q: string };

      const results = await fetchGeocodeData(q);

      return reply.send(results);
    },
    
  });
}


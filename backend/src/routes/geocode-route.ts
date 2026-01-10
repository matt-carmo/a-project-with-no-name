import axios from "axios";
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
  const response = await axios.get<NominatimResult[]>(
    "https://nominatim.openstreetmap.org/search",
    {
      params: {
        q: `${q} Presidente Prudente SP`,
        format: "json",
        limit: 5,
        addressdetails: 1,
      },
      headers: {
        "User-Agent": "a-project-with-no-name/1.0 (matheus2018i@gmail.com)",
        "Accept": "application/json",
      },
      timeout: 5000,
    }
  );

  return response.data.map(item => ({
    displayName: `${item.address?.road ?? ""}, ${item.address?.suburb ?? ""}`,
    lat: Number(item.lat),
    lon: Number(item.lon),

    road: item.address?.road ?? "",
    district: item.address?.suburb ?? "",
    city: item.address?.city ?? "",
    state: item.address?.state ?? "",
    zipCode: item.address?.postcode ?? "",
  }));
}



export async function GeocodeRoutes(server: FastifyInstance) {
  server.get("/geocode", {
  config: { public: true },

  handler: async (request, reply) => {
    try {
      const { q } = request.query as { q?: string };

      if (!q) {
        return reply.status(400).send({ message: "Query q é obrigatória" });
      }

      const results = await fetchGeocodeData(q);
      return reply.send(results);

    } catch (err) {
      console.error("GEOCODE ERROR:", err);
      return reply.status(500).send({
        message: "Erro interno no geocode"
      });
    }
  },
});

}


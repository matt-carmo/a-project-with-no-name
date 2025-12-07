import { FastifyReply, FastifyRequest } from "fastify";
import GroupsComplementsService from "../services/groups-complements.service";
import { GroupsComplementsRepository } from "../repositorires/groups-complements.repository";


export class GroupsComplementsController {
    constructor(private service: GroupsComplementsService) { }

    async create(req, reply) {
        const groupRaw = req.body.group; // é um campo de texto
        const images = req.body.images;  // é um array de arquivos

        // 1) Parse do grupo
        const group = JSON.parse(groupRaw.value);

        // 2) Normalizar arquivos
        const files = Array.isArray(images) ? images : [images];

        // 3) Juntar complements + imagens por índice
        group.complements = group.complements.map((c, index) => {
            const file = files[index];

            return {
                ...c,
                image: file ? file : null,
            };
        });



        const result = await this.service.create({ data: { group, files }, storeId: req.params.storeId });

        console.log('result', result);
        return reply.status(201).send(result);
    }
}
function parseMultipart(body: any) {
    const result: any = {};

    for (const key in body) {
        const field = body[key];
        const value = field.type === "file" ? field : field.value;

        // Ex: complements[1][image]
        const parts = key.split(/\[|\]/).filter(Boolean);

        let current = result;

        parts.forEach((part, index) => {
            const isLast = index === parts.length - 1;

            if (isLast) {
                current[part] = value;
            } else {
                if (!current[part]) {
                    current[part] = /^\d+$/.test(parts[index + 1]) ? [] : {};
                }
                current = current[part];
            }
        });
    }

    return result;
}


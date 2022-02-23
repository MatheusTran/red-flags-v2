import { Client, Entity, schema, Repository, Schema, Repository} from "redis-om";

const client = new Client();

async function connect(){
    if (!client.isOpen()){
        await client.open(process.env.REDIS_URL)
    }
}

class room extends Entity{}
let schema = new Schema(
    room, {
        roomName:{ type: "string"},
        start: { type: "boolean"},
        data:{ type: "object"},
        players: { type: "array"},
        waiting: {type:"array"}
    },
    {
        dataStructure: "JSON"
    }
);

export async function createRoom(data){
    await connect();

    const repo = new Repository(schema, client)

    const room = repo.createEntity(data);

    const id = await repo.save(room)
    return id
}
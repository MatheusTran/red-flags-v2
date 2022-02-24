import { createRoom } from "../lib/redis";

export default async function handler(req, res){
    const id = await createRoom(req.body);
    res.status(200).json({id})
}
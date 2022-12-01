import { Prisma } from "@prisma/client";
import prisma from "../database/prisma";

const PlayerModel = {
	getPlayer: async (selectObject: Prisma.playerWhereInput) => {
		return await prisma.player.findFirst({
			where: selectObject,
		});
	},

	getPlayers: async (selectObject: Prisma.playerWhereInput) => {
		return await prisma.player.findMany({
			where: selectObject,
		});
	},

	getPlayersInRoom: async (roomId: string) => {
		return await PlayerModel.getPlayers({ game_room_id: roomId });
	},

	setPlayerAsPartyLeader: async (playerId: string) => {
		return await prisma.player.update({
			where: {
				player_id: playerId,
			},
			data: {
				is_party_leader: true,
			},
		});
	},

	createPlayer: async (player: Prisma.playerCreateInput) => {
		return await prisma.player.create({
			data: {
				...player,
			},
		});
	},
};

export default PlayerModel;
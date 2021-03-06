import { toId, now, needGroup, ADMIN } from '../util/index'
import { ObjectID } from 'mongodb'

export function updateAnime(
	root: any,
	{ id, anime }: { id: ID, anime: AnimeInput },
	context: Context
): Promise<ID> {
	transformAnime(anime, now(), context.storage)
	return needGroup(context, ADMIN).then(() =>
		context.db
			.collection('animes')
			.updateOne({ _id: id }, { $set: anime })
			.then(() => id)
	)
}

export function addAnime(
	root: any,
	{ anime }: { anime: AnimeInput },
	context: Context
): Promise<ID> {
	const time = now()
	transformAnime(anime, time, context.storage)
	// $FlowIgnore
	anime.posted_date = time
	// $FlowIgnore
	anime._id = toId(anime.names[0])
	anime.tags = anime.tags.map(t => new ObjectID(t))
	anime.authors = anime.authors.map(a => new ObjectID(a))
	return needGroup(context, ADMIN).then(() =>
		context.db
			.collection('animes')
			.insertOne({
				...anime,
				medias: [],
				seasons: []
			})
			.then(({ insertedId }) => insertedId)
	)
}

function transformAnime(anime: any, time, storage) {
	if (anime.cover) anime.cover = storage.getUrl(anime.cover)
	if (anime.background) anime.background = storage.getUrl(anime.background)
	anime.edit_date = time
}

export function addSeason(
	root: any,
	{ anime, season }: { anime: ID, season: SeasonInput },
	context: Context
) {
	let seasonNb = season.season
	delete season.season
	const time = now()
	// $FlowIgnore
	season.edit_date = time
	// $FlowIgnore
	season.posted_date = time
	return needGroup(context, ADMIN).then(() =>
		context.db
			.collection('animes')
			.updateOne(
				{ _id: anime },
				{ $set: { [`seasons.${seasonNb.toString()}`]: season } }
			)
			.then(() => ({ anime, ...season }))
	)
}

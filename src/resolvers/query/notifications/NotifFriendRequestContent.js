import { ObjectID } from 'mongodb'
export { user } from './Notification'

export function _from({ _from }: { _from: ID }, args: any, context: Context) {
	return context.db
		.collection('users')
		.find({ _id: new ObjectID(_from) })
		.limit(1)
		.map(({ _id, ...fields }) => ({ id: _id, ...fields }))
		.next()
}

export function user({ user }: { user: ID }, args: any, context: Context) {
	return context.db
		.collection('users')
		.find({ _id: new ObjectID(user) })
		.limit(1)
		.map(({ _id, ...fields }) => ({ id: _id, ...fields }))
		.next()
}

import moment from 'moment'

export const getTimeFormat = (date: string) => {
	return moment(date).format('DD/MM/YYYY')
}

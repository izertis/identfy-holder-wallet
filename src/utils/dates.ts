import moment from 'moment'

export const getTimeFormat = (date: string | number) => {
	if (typeof date === 'number') {
		return moment.unix(date).format('DD/MM/YYYY')
	}
	return moment(date).format('DD/MM/YYYY')
}

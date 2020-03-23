// @ts-check
import moment from 'moment'


/**
 * @param {gameData} gameData 
 * @param {number} index
 * @returns {Factory}
 */
function CalcFactory(gameData, index) {
	switch (gameData.mode) {
		case "every day":
			return new EveryDay(gameData, index)
		case "Step":
			return new Step(gameData, index)
		case "day of week":
			return new DayOfWeek(gameData, index)
		default:
			console.log(`mode incorrect. => ${this.gameData.mode}`)
			break;
	}
}

// @ts-ignore
/** @typedef {Factory} Factory */
// @ts-ignore
class Factory {

	/**
	 * 
	 * @param {gameData} gameData 
	 * @param {number} index 
	 */
	constructor(gameData, index) {
		this.gameData = gameData

		const currentTime = moment.utc().utcOffset(gameData.UTC ?? 7)

		// https://momentjscom.readthedocs.io/en/latest/moment/03-manipulating/09-utc-offset/ return offset is min  
		const local_utc = moment().utcOffset() / 60

		/** @type {cardData} */
		this.cardData = {
			id: index,
			name: gameData.name,
			UTC: gameData.UTC,
			mode: gameData.mode,
			image: gameData.image,
			currentTime: currentTime,
			newDayTime: currentTime.clone().hours(gameData.newDay.hours + ((gameData.UTC ?? 7) - local_utc) || 0).minutes(gameData.newDay.minutes || 0).seconds(0),
			// remainingTime: undefined
		}
	}

	init() {
		console.log('need implements.')
		console.log(this.gameData.name)
		return 0
	}

	updateNewDay() {
		console.log('need implements.')
	}
}

class EveryDay extends Factory {
	constructor(gameData, index) {
		super(gameData, index)

		const diff = this.cardData.newDayTime.diff(this.cardData.currentTime, 'seconds')
		if (diff < 0)
			this.cardData.newDayTime.add(1, 'days')
		this.cardData.remainingTime = this.cardData.newDayTime.diff(this.cardData.currentTime, 'seconds')
	}

	updateNewDay() {
		return this.cardData.newDayTime.clone().add(1, 'days')
	}
}

class Step extends Factory {
	constructor(gameData, index) {
		super(gameData, index)
		console.log('step: ' + this.gameData.step)
		this.nextEvent()
		this.cardData.remainingTime = this.cardData.newDayTime.diff(this.cardData.currentTime, 'seconds')
	}

	nextEvent() {
		// const newDay = moment(this.gameData?.startDate)
		//     .hours(this.gameData.newDay.hours)
		//     .minutes(this.gameData.newDay.minutes)
		//     .utcOffset(this.gameData.UTC || 7)
		//     .add(step, 'days')
		// const diff = newDay.diff(this.cardData.currentTime, 'seconds')
		// if (diff < 0)
		//     return this.nextEvent(this.gameData?.step)
		// return this.cardData.newDayTime = newDay

		const newDay = moment(this.gameData?.startDate)
			.hours(this.gameData.newDay.hours)
			.minutes(this.gameData.newDay.minutes)
			.utcOffset(this.gameData.UTC || 7)

		const diff = newDay.diff(this.cardData.currentTime, 'seconds')
		if (diff < 0) {
			const diffDays = newDay.diff(this.cardData.currentTime, 'days')
			console.log('diff ' + diffDays)
			console.log((diffDays % this.gameData.step))
			newDay.add(Math.abs(diffDays) + Math.abs(diffDays % this.gameData.step), 'days')

			// if startDate is today
			if (newDay.diff(this.cardData.currentTime, 'seconds') < 0)
				newDay.add(this.gameData.step, 'days')
		}
		this.cardData.newDayTime = newDay
	}

	updateNewDay() {
		return this.cardData.newDayTime.clone().add(this.gameData.step, 'days')
	}
}

class DayOfWeek extends Factory {
	constructor(gameData, index) {
		super(gameData, index)
		this.nextEvent()
		this.cardData.remainingTime = this.cardData.newDayTime.diff(this.cardData.currentTime, 'seconds')
	}

	nextEvent(round = 0) {
		for (const index in this.gameData.dayOfWeek) {
			if (this.gameData.dayOfWeek.hasOwnProperty(index)) {
				const dayBoolean = this.gameData.dayOfWeek[index];
				// console.log(`game: ${this.gameData.name} | ${dayBoolean}`)
				if (!dayBoolean)
					continue
				const newDay = this.cardData.newDayTime.clone()
				const diff = newDay.day(+index + round).diff(this.cardData.currentTime, 'seconds')
				if (diff > 0) {
					console.log(`game: ${this.gameData.name} | ${index}`)
					this.cardData.newDayTime = newDay
					return
				}
			}
		}
		// if this all day of week diff < 0
		// add 1 week with 7 daya
		this.nextEvent(7)
	}

	// !!!
	updateNewDay(round = 0) {
		for (const index in this.gameData.dayOfWeek) {
			if (this.gameData.dayOfWeek.hasOwnProperty(index)) {
				const dayBoolean = this.gameData.dayOfWeek[index];
				if (!dayBoolean)
					continue
				const newDay = this.cardData.newDayTime.clone()
				const diff = newDay.day(+index + round).diff(this.cardData.currentTime, 'seconds')
				if (diff > 0) {
					return newDay
				}
			}
		}
		// if this all day of week diff < 0
		// add 1 week with 7 daya
		this.nextEvent(7)
	}
}


export default CalcFactory

/**
 * @typedef {Object} gameData
 * @property {string} name
 * @property {number} UTC
 * @property {Object} newDay
 * @property {number} newDay.hours
 * @property {number} newDay.minutes
 * @property {"every day" | "Step" | "day of week"} mode
 * @property {Array<Boolean>} dayOfWeek
 * @property {number} [step]
 * @property {string} [startDate]
 * @property {string} image
 */

/**
 * @typedef {Object} cardData
 * @property {number} id
 * @property {gameData["name"]} name
 * @property {gameData["UTC"]} UTC
 * @property {gameData["mode"]} mode
 * @property {gameData["image"]} image
 * @property {import('moment').Moment} currentTime
 * @property {import('moment').Moment} newDayTime
 * @property {number} [remainingTime] remaining time to new day [second]
 *
 */
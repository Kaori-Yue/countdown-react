import React, { Component } from "react";
import { BrowserRouter, Link, useLocation, withRouter } from "react-router-dom";
import Card from "../../components/card";
import moment from "moment";
import Header from "./header";
import CalcFactory from '../../controller/timeCalc'
class Home extends Component {
	constructor(props) {
		super(props);
		this.state = {
			/** @type {import("../../controller/timeCalc").Factory[]} */
			items: []
		};
	}

	render() {
		if (this.state.items.length <= 0) return <div>Loading..</div>;

		return (
			<div>
				{/* {this.createCard()} */}

				<Header />

				{this.state.items.map(item => {
					return <Card data={item.cardData} />;
				})}
			</div>
		);
	}

	componentDidMount() {
		fetch(
			"https://script.googleusercontent.com/macros/echo?user_content_key=VN7U4mhGJ-8ZFdrfcABKnQhx2dj-5_yeKzosG1PjXOLzWYudLV40ev75YakJUdN_CO-IQXxH4ktuHArk-jnQjHoCauGDjO03m5_BxDlH2jW0nuo2oDemN9CCS2h10ox_1xSncGQajx_ryfhECjZEnExBQJ2cQrB3Og5A8AFkIlONi0ni_WZ9QJSLVV06jwXjNlhfI9UcBdDSyTMPFw7m1WYoMBW-gZbu&lib=MCuPeLKKocSs0H6dSi1lvI6hDhZKDn1Ou"
		)
			.then(res => res.json())
			.then(result => {
				/** @type {import('../../controller/timeCalc').Factory[]} */
				const items = result.map(CalcFactory)
				console.log(items[0])
				
				// this.setState({ items })


				// const items = result.map(this.initCard.bind(this));
				// console.log(this.props);
				// check url & sort
				const query = new URLSearchParams(this.props.location.search);
				const sortBy = query.get("sort");
				if (sortBy === "name") items.sort((a, b) => (a.cardData.name > b.cardData.name ? 1 : -1));
				if (sortBy === "time")
					items.sort((a, b) => (a.cardData.remainingTime > b.cardData.remainingTime ? 1 : -1));

				console.log(items);
				this.setState({ items });
				// console.log(this.state)
				// this.updateTime()
				// console.log(this.state)
				setInterval(this.updateTime.bind(this), 1000);
				// this.updateTime()

			});

		// this.setState({
		//     items: ["fake"]
		// })
	}

	initCard(item, index) {
		console.log("card: " + JSON.stringify(item));
		const local_utc = moment().utcOffset() / 60;
		item.index = index;
		item.currentTime = moment.utc().utcOffset(+item.UTC || 7);
		// current.clone().hours(+this.state.end?.hours + ((this.state.UTC || 7) - local_utc) || 0).minutes(+this.state.end?.minutes || 0).seconds(0)
		item.endDay = item.currentTime
			.clone()
			.hours(+item.end?.hours + ((+item.UTC || 7) - local_utc) || 0)
			.minutes(+item.end?.minutes || 0)
			.seconds(0);

		if (item.start)
			item.endDay = moment(item.start)
				.hours(item.end.hours)
				.minutes(item.end.minutes);

		// if (+item.step > 1) {
		// 	item.endDay.add(+item.step, 'days')
		// }

		// const diff = item.endDay.diff(item.currentTime)
		// if (diff < 0) {
		// 	// TODO: change state and fix google script
		// 	item.endDay.add(this?.state?.step || 1, 'days')
		// 	item.remainingTime = item.endDay.diff(item.current)
		// } else
		// 	item.remainingTime = item.endDay.diff(item.currentTime)
		item.remainingTime = this.calcRemainingTime(
			item.currentTime,
			item.endDay,
			item.step
		);

		return item;
	}

	/**
	 *
	 * @param {moment.Moment} curr
	 * @param {moment.Moment} end
	 */
	calcRemainingTime(curr, end, step) {
		const diff = end.diff(curr);
		if (diff < 0) {
			end.add(+step, "days");
		}
		return end.diff(curr);
	}

	updateTime() {
		const newItems = this.state.items.map(item => ({
			...item, // copy all
			// override
			cardData: {
				...item.cardData,
				currentTime: moment.utc().utcOffset(item.gameData.UTC ?? 7),
			},

			// remainingTime: this.calcRemainingTime(
			// 	item.currentTime,
			// 	item.endDay,
			// 	item.step
			// )
			// test: item.endDay.diff()
		}));

		const query = new URLSearchParams(this.props.location.search);
		const sortBy = query.get("sort");
		if (sortBy === "name") newItems.sort((a, b) => (a.cardData.name > b.cardData.name ? 1 : -1));
		if (sortBy === "time")
			newItems.sort((a, b) => (a.cardData.remainingTime > b.cardData.remainingTime ? 1 : -1));
		if (sortBy === "" || sortBy === null)
			newItems.sort((a, b) => (a.cardData.id > b.cardData.id ? 1 : -1));

		this.setState({
			items: newItems
		});
	}
}

function useQuery() {
	return new URLSearchParams(useLocation().search);
}

// export default () => {
// 	return (
// 		<BrowserRouter>
// 			<Home />
// 		</BrowserRouter>
// 	)
// }

export default withRouter(Home);

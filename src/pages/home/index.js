//@ts-check
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

				// check url & sort
				const query = new URLSearchParams(this.props.location.search);
				const sortBy = query.get("sort");
				if (sortBy === "name") items.sort((a, b) => (a.cardData.name > b.cardData.name ? 1 : -1));
				if (sortBy === "time")
					items.sort((a, b) => (a.cardData.remainingTime > b.cardData.remainingTime ? 1 : -1));

				console.log(items);
				this.setState({ items });
				setInterval(this.updateTime.bind(this), 1000);
			});

		// this.setState({
		//     items: ["fake"]
		// })
	}

	updateTime() {
		const newItems = this.state.items.map(item => ({
			...item, // copy all
			// override
			cardData: {
				...item.cardData,
				currentTime: moment.utc().utcOffset(item.gameData.UTC ?? 7),
				remainingTime: item.cardData.newDayTime.diff(item.cardData.currentTime, 'seconds'),
				newDayTime: item.cardData.remainingTime > 0 ? item.cardData.newDayTime : item.updateNewDay()
			},
		}));

		const query = new URLSearchParams(this.props.location.search);
		const sortBy = query.get("sort");
		if (sortBy === "name") newItems.sort((a, b) => (a.cardData.name > b.cardData.name ? 1 : -1));
		if (sortBy === "time")
			// USE => FIX BUG SAME TIME SWAP ALWAYS
			newItems.sort((a, b) => (a.cardData.remainingTime >= b.cardData.remainingTime ? 1 : -1));
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

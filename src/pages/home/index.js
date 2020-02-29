import React, { Component } from 'react'
import { BrowserRouter, Link, useLocation } from 'react-router-dom'
import Card from '../../components/card'
import moment from 'moment'
import Header from './header'

class Home extends Component {
    constructor(props) {
        super(props)
        this.state = {
            items: []
        }
    }

    render() {
        if (this.state.items.length <= 0)
            return <div>Loading..</div>

        return (
            <div>
                {/* {this.createCard()} */}

                <Header />
                {this.state.items.map(item => {
                    return (<Card
                        gameName={item.name}
                        UTC={item.UTC}
                        end={item.end}
                        image={item.image}
                    />)
                })}

            </div>
        )
    }

    componentDidMount() {
        fetch("https://script.googleusercontent.com/macros/echo?user_content_key=VN7U4mhGJ-8ZFdrfcABKnQhx2dj-5_yeKzosG1PjXOLzWYudLV40ev75YakJUdN_CO-IQXxH4ktuHArk-jnQjHoCauGDjO03m5_BxDlH2jW0nuo2oDemN9CCS2h10ox_1xSncGQajx_ryfhECjZEnExBQJ2cQrB3Og5A8AFkIlONi0ni_WZ9QJSLVV06jwXjNlhfI9UcBdDSyTMPFw7m1WYoMBW-gZbu&lib=MCuPeLKKocSs0H6dSi1lvI6hDhZKDn1Ou")
            .then(res => res.json())
            .then(result => {
                this.setState({
                    items: result
                })
            })

        // this.setState({
        //     items: ["fake"]
        // })
    }

    createCard = () => {
        let card = []
        for (let i = 0; i < 3; i++) {
            card.push(<Card
                gameName="Arknight"
                currentTime={moment.utc().utcOffset(7).format()}
                endDay={moment("18:00").format()}
                image="https://cdn.discordapp.com/attachments/586589326813429800/683163557034196992/77987370_p0_master1200.jpg"
            />)
        }
        return card
    }
}


export default () => {
    return (
        <BrowserRouter>
            <Home></Home>
        </BrowserRouter>
    )
}
import React, { Component } from 'react'
import moment from 'moment'

class Card extends Component {
    constructor(props) {
        super(props)
        this.state = {
            ...props
        }
    }

    componentDidMount() {
        // https://momentjscom.readthedocs.io/en/latest/moment/03-manipulating/09-utc-offset/ return offset is min
        const local_utc = moment().utcOffset() / 60
        setInterval(() => {
            const current = moment.utc().utcOffset(this.state.UTC || 7)
            const endDay = current.clone().hours(+this.state.end?.hours + ((this.state.UTC || 7) - local_utc) || 0).minutes(+this.state.end?.minutes || 0).seconds(0)
            // const endDay = current.clone().hours(6).minutes(25).seconds(5)
            let diff = endDay.diff(current)
            if (diff < 0) {
                endDay.add(this.state.step || 1, 'days')
                diff = endDay.diff(current)
            }

            this.setState({
                currentTime: current.format(),
                endDay: endDay.format(),
                // remaining: endDay.format()
                remaining: this.formatCountdown(diff),
                // UTC: this.state.UTC || "+7 (default)"
                UTC: this.state.UTC
                // UTC: this.state.UTC === "" ? "+7 (default)" : this.state.UTC >= 0 ? `+${this.state.UTC}` : this.state.UTC
            })
        }, 1000);
    }

    formatCountdown(diff) {
        const duration = moment.duration(diff)
        return `${duration.days()}d ${duration.hours()}hh ${duration.minutes()}mm ${duration.seconds()}ss`
    }

    render() {
        return (
            <div class="columns is-vcentered">
                <div class="column is-one-quarter">
                    {/* Image */}
                    <figure class="image is-16by9">
                        <img src={this.state.image || "https://bulma.io/images/placeholders/640x360.png"} alt="Placeholder image" />
                    </figure>
                </div>

                <div class="column">
                    {/* Info */}
                    Game: {this.state.gameName ?? "N/A"} <br />
                    In-game: {this.state.currentTime ?? "N/A"} <br />
                    End day: {this.state.endDay ?? "N/A"} <br />
                    Remaining: {this.state.remaining ?? "N/A"} <br />
                    UTC: {this.state.UTC === "" ? "+7 (default)" : this.state.UTC >= 0 ? `+${this.state.UTC}` : this.state.UTC} <br />
                </div>

                <div class="column">Auto</div>
            </div>
        )
    }
}

export default Card
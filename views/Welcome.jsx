import React from 'react'

const Welcome = React.createClass({
  render() {
    return (
      <section className="column is-offset-6 is-6">
        <p>Welcome <b> {this.props.name} </b> </p>
        <div>
          Click <a href="/">here</a> to logout.
        </div>
      </section>
    )
  },
})

export default Welcome

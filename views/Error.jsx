import React from 'react'

const Error = React.createClass({
  render() {
    return (
      <section className="column is-offset-6 is-6">
        <p>Error Page</p>
        <p> {this.props.error}</p>
        { this.props.name === "Register" ?
          <div>Click <a href='/register'>here </a>to Register. </div>
          :
          <div> Click <a href='/'>here </a>to Login. </div>
        }
      </section>
    )
  },
})

export default Error

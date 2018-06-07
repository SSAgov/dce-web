import React, { Component, PropTypes } from 'react';
import Header from './Header'
import Footer from './Footer'
import { connect } from 'react-redux';

class Root extends Component {

  render() {
    return (
      <div>
        <Header environment={this.props.environment} />
        {this.props.children}
        <Footer />
      </div>
    );
  }
}

Root.propTypes = {
  children: PropTypes.object.isRequired,
  environment: PropTypes.object.isRequired
};

function mapStateToProps(state, ownProps) {
  return {
    environment: state.environment
  };
}

export default connect(mapStateToProps)(Root);

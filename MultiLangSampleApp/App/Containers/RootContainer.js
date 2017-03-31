import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import StartupActions from '../Redux/StartupRedux'
import ReduxPersist from '../Config/ReduxPersist'

import { StackNavigator } from 'react-navigation'

import WelcomeContainer from '../Containers/WelcomeContainer'
import SettingsContainer from '../Containers/SettingsContainer'
import About from '../Components/About'

const AppNavigator = StackNavigator({
  Home: {
    screen: WelcomeContainer,
    navigationOptions: {
      title: 'Multi Language Sample App' // we advice using something static like your app's name or company name on the startup screen
    }
  },
  Settings: {
    screen: SettingsContainer,
    navigationOptions: {
      title: (navigation) => {
        return navigation.state.params.title
      }
    }
  },
  About:{
    screen: About,
    navigationOptions: {
      title: (navigation) => {
        return navigation.state.params.title
      }
    }
  }
})

class RootContainer extends Component {
  componentDidMount() {
    if (!ReduxPersist.active) {
      this.props.startup()
    }
  }

  render() {
    return (
      <AppNavigator />
    )
  }
}

const mapStateToDispatch = dispatch => ({
  startup: () => dispatch(StartupActions.startup())
})


export default connect(null, mapStateToDispatch)(RootContainer)

RootContainer.propTypes = {
  startup: PropTypes.func.isRequired
}

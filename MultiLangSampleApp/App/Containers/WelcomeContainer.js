import React, { Component, PropTypes } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { connect } from 'react-redux'
import I18n from 'react-native-i18n'
import MyButton from '../Components/MyButton'
import { navigate } from 'react-navigation'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

class WelcomeContainer extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    const {language} = this.props
    const {navigate, setParams} = this.props.navigation
    return (
      <View style={ styles.container }>
        <Text style={ styles.welcome }>
          { I18n.t('home.welcome', { locale: language }) }
        </Text>
        <Text style={ styles.instructions }>
          { I18n.t('home.instruction', { locale: language }) }
        </Text>
        <MyButton buttonTitle={ I18n.t('home.go_to', { locale: language }).toUpperCase() + " " + I18n.t('settings.title', { locale: language }).toUpperCase() }
                  onButtonPress={ () => navigate('Settings', {
                                    title: I18n.t('settings.title', { locale: language }) // <- passing the title here
                                  }) 
                                } />
        <MyButton buttonTitle={ I18n.t('home.go_to', { locale: language }).toUpperCase() + " " + I18n.t('about.title', { locale: language }).toUpperCase() }
                  onButtonPress={ () => navigate('About', {
                                    title: I18n.t('about.title', { locale: language }) // <- passing the title here
                                  }) 
                                } />
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    language: state.settings.language
  }
}

export default connect(mapStateToProps, null)(WelcomeContainer)

WelcomeContainer.propTypes = {
  language: PropTypes.string.isRequired,
}
import React, { Component, PropTypes } from 'react'
import { View, Text, Picker, StyleSheet } from 'react-native'
import { connect } from 'react-redux'
import SettingsActions from './../Redux/SettingsRedux'
import I18n from 'react-native-i18n'

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flex: 1,
  },
  header: {
    fontSize: 20,
    textAlign: 'left',
    marginVertical: 10,
    marginLeft: 10,
  },
  picker: {
    flex: 1,
    marginRight: 10,
  }
});

class SettingsContainer extends Component {

  render() {
    const {language, changeLanguage} = this.props
    const {setParams} = this.props.navigation

    const languageOptions = Object.keys(I18n.translations).map((lang, i) => {
      return (
        <Picker.Item key={ i }
                     label={ I18n.translations[lang].id }
                     value={ lang } />)
    })

    return (
      <View style={ styles.container }>
        <Text style={ styles.header }>
          { I18n.t('settings.language') }
        </Text>
        <Picker style={ styles.picker }
                selectedValue={ language }
                onValueChange={ this._languageChanged(changeLanguage, setParams) }>
          { languageOptions }
        </Picker>
      </View>
    )
  }

  _languageChanged = (changeLanguage, setParams) => (newLang) => {
    changeLanguage(newLang)
    setParams({
      title: I18n.t('settings.title', { locale: newLang })
    })
  }
}

const mapStateToProps = (state) => {
  return {
    language: state.settings.language,
  }
}

const mapStateToDispatch = dispatch => ({
  changeLanguage: (newLang) => dispatch(SettingsActions.changeLanguage(newLang))
})

export default connect(mapStateToProps, mapStateToDispatch)(SettingsContainer)

SettingsContainer.propTypes = {
  changeLanguage: PropTypes.func.isRequired,
  language: PropTypes.string.isRequired
}
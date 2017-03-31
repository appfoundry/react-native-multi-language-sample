import React, { Component, PropTypes } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import I18n from 'react-native-i18n'

const styles = StyleSheet.create({
  container: {
    marginTop: 40
  },
  header: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  explanation: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  }
});

export default class About extends Component {
  render() {
    return (
      <View style={ styles.container }>
        <Text style={ styles.header }>
          { I18n.t('about.info') }
        </Text>
        <Text style={ styles.explanation }>
          { I18n.t('about.explanation') }
        </Text>
      </View>
    )
  }
}
import React, { Component, PropTypes } from 'react'
import { View, Button, StyleSheet } from 'react-native'

const styles = StyleSheet.create({
  container: {
    marginTop: 40
  }
});

export default class MyButton extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    const {buttonTitle, onButtonPress} = this.props
    return (
      <View style={styles.container}>
        <Button title={ buttonTitle } 
                onPress={ onButtonPress } 
                color="black" />
      </View>
    )
  }
}

MyButton.propTypes = {
  onButtonPress: PropTypes.func.isRequired,
  buttonTitle: PropTypes.string.isRequired
}
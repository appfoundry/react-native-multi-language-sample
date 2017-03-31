import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'
import I18n from 'react-native-i18n'

/* ------------- Types and Action Creators ------------- */

const {Types, Creators} = createActions({
  changeLanguage: ['language']
})

export const SettingsTypes = Types
export default Creators

/* ------------- Initial State ------------- */
export const INITIAL_STATE = Immutable({
  language: I18n.locale.substr(0, 2) // take over the recognized, or default if not recognized, language locale as initial state
})

/* ------------- Reducers ------------- */

// request the data from an api
export const changeLanguage = (state, {language}) => state.merge({
  language
})

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.CHANGE_LANGUAGE]: changeLanguage,
})

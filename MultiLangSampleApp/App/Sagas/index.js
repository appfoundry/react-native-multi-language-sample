import { takeLatest } from 'redux-saga/effects'

/* ------------- Types ------------- */

import { StartupTypes } from '../Redux/StartupRedux'
import { SettingsTypes } from '../Redux/SettingsRedux'

/* ------------- Sagas ------------- */

import { startup } from './StartupSagas'
import { updateLanguage } from './SettingsSaga'

/* ------------- Connect Types To Sagas ------------- */

export default function* root() {
  yield[
    takeLatest(StartupTypes.STARTUP, startup),
    takeLatest(SettingsTypes.CHANGE_LANGUAGE, updateLanguage)
  ]
}

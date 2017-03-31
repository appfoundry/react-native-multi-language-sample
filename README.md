# react-native-multi-language-sample
A tutorial on how to implement user-selectable language settings for your react-native app.

# Tutorial

First initialize a React Native app with:
1. [React Native](https://facebook.github.io/react-native/releases/next/docs/getting-started.html) **>= 0.40** (At the time of writing this post React Native's _Current Version_ was 0.42 and is also the version being used in this tutorial.)
2. Redux ([redux](https://github.com/reactjs/redux), [react-redux](https://github.com/reactjs/react-redux), [reduxsauce](https://github.com/skellock/reduxsauce), [redux-saga](https://github.com/redux-saga/redux-saga), [redux-persist](https://github.com/rt2zz/redux-persist), [redux-logger](https://github.com/evgenyrodionov/redux-logger) and [seamless-immutable](https://github.com/rtfeldman/seamless-immutable))
3. [react-native-i18n](https://github.com/AlexanderZaytsev/react-native-i18n#installation)
4. [rn-translate-template](https://github.com/hiaw/rn-translate-template#installation)
5. [React Navigation](https://reactnavigation.org/docs/intro/#Setup-and-Installation) (At the time of writing this post React Navigation's _Current Version_ was 1.0.0-beta.7 and is also the version being used in this tutorial.)

## First steps

Import the custom I18n.js file (which came with rn-translate-template and initializes the I18n configuration) in the most top-level application file (or at least in an application file _above_ all other files - files where redux and react-native-i18n are used). Also consider importing the I18n.js file before importing other components, to prevent those other components from crashing when they use the react-native-i18n plugin.

```js
// App.js
import '../I18n/I18n' // import this before RootContainer as RootContainer is using react-native-i18n, and I18n.js needs to be initialized before that!
import RootContainer from './RootContainer'
```

> I import I18n.js in my App.js file because App.js is used in index.android.js and in index.ios.js, which makes it a top-level application file, and because it does not use redux and react-native-i18n. As you can see, I import it before the RootContainer component. I do this because I want the I18n configuration to be available at the root of my app _before_ I make use of react-native-i18n’s translate function in components (such as RootContainer).

Define `I18n.fallbacks = true` in the custom I18n.js file. When the device's locale is not available in the defined translations, it will fall back to the default locale. This is 'en' (English) by default but we can adjust this by, for example, defining `I18n.defaultLocale = 'nl'`. 

> If your app does not support English, it is imperative to change the _defaultLocale_'s value!

## Adding translations

Now that we have I18n initialized in our app, we can add translations. We can do this in our I18n.js file by requiring the translation files:

```js
// I18n.js
I18n.translations = {
  en: require('./english.json'),
  nl: require('./nl.json')
}
```
After adding these translations, we can delete the remaining code in the I18n.js template file.
> That remaining code (a _switch_ based on the locale) does almost the same as the translations object we just defined, the difference being the remaining code would require the one translation file of the device’s language (if available). When we would want to switch the language in our app we would have to import translations at that moment, and our code would become a mess.
With the translations object, we can keep things clear and the configuration in one place.

## Language as a user-specific setting

At this point our app will be able to take over the device’s language on startup, given the according translation file is added in the translations object. If not, it will use the language defined in I18n's _defaultLocale_ parameter.
In order to **let the user switch the language** in the app and successfully render the newly chosen language we will be using **redux and sagas**. This part of the tutorial explains how to define the app's language as a user setting.

We will use a 'Settings' reducer connected to a saga to set `I18n.locale` to the newly chosen language.
```js
// ../Redux/SettingsRedux.js
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
export const changeLanguage = (state, {language}) => state.merge({
  language
})

/* ------------- Hookup Reducers To Types ------------- */
export const reducer = createReducer(INITIAL_STATE, {
  [Types.CHANGE_LANGUAGE]: changeLanguage,
})
```

Create the saga that will update _I18n.locale_:
```js
// ../Sagas/SettingsSaga.js
import I18n from 'react-native-i18n'

export function updateLanguage(action) {
  const {language} = action
  I18n.locale = language
}
```

Connect the action from the reducer with the saga:
```js
// ../Sagas/index.js
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
```

In the application’s 'Startup' saga we will have to call the ‘changeLanguage’ action, which uses the _language_ parameter from the 'Settings' reducer, to **enforce the correct language**.
```js
// ../Sagas/StartupSagas.js
import { put, select } from 'redux-saga/effects' 
import SettingsActions from '../Redux/SettingsRedux'

export const selectLanguage = state => state.settings.language // get the language from the settings reducer

// process STARTUP actions
export function* startup(action) {
  const language = yield select(selectLanguage)

  // Always set the I18n locale to the language in the settings, or the views would render in the language of the device's locale and not that of the setting.
  yield put(SettingsActions.changeLanguage(language))
}
```

Next **create a view** where the user can **choose an other language**. Use the _I18n.translations_ object to construct the options for the language picker. Connect the picker's _onValueChange_ property with the 'changeLanguage' action and the connected saga will take care of re-defining _I18n.locale_ with the chosen language. Finally, declare the picker's _selectedValue_  with the current _language_ property, to set the current language as the default chosen option when the user enters this view.

```js
// ../Containers/SettingsContainer.js
render(){
  const {language, changeLanguage} = this.props
  const {setParams} = this.props.navigation
  const languageOptions = Object.keys(I18n.translations).map((lang, i) => {
    return (<Picker.Item key={ i }
                          label={ I18n.translations[lang].id }
                          value={ lang } />)
  })

  return(<Picker selectedValue={ language }
                 onValueChange={ this._languageChanged(changeLanguage, setParams) }>
           { languageOptions }
         </Picker>)
}
_languageChanged = (changeLanguage, setParams) => (newLang) => {
  changeLanguage(newLang)
}
```

We can fill in the labels of the picker's options by using an ‘id’ parameter in the language files defining the name of the language, e.g. `"id": "English"` in en.json and `"id": "Nederlands"` in nl.json.

There is now one more thing left to do: **each view that implements I18n and is rendered on startup needs to have the language setting connected** to the view. We will need to use this _language_ property in our _I18n.translate_ function like so:
`I18n.t(‘my.word’, { locale: this.props.settings.language })`. (Take note of the _locale_ parameter being set in the translation function.)

This is necessary because the views rendered on startup will not be aware of the locale being set in the startup saga. These views will have rendered before that (it’s a race condition) so by mapping the language setting to the props of those views we will have to trigger their translation again.

> If you’re not sure if the view will be rendered on startup you can connect the view and map the property just in case, there should not be any performance issues.

## React Navigation Specific Code
In this tutorial and sample we use React Navigation's [StackNavigator](https://reactnavigation.org/docs/navigators/stack) which means we will have to write additional code to update the titles of the views.

Set up the **stack navigation** and set up your views:

```js
// ../Containers/RootContainer.js
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

...

  render() {
    return (
      <AppNavigator />
    )
  }
```

We declare the titles of the views as a parameter which will be passed when navigating to a certain screen.
> Unfortunately I have not yet found a way how to update the title of the root view. For now I use a static title such as a company name or the application's name. If you have an idea let us know in the comments below! 

Pass the title as an extra parameter in the navigate function:

```js
// ../Containers/WelcomeContainer.js
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
```

One last thing, by using React Navigation's _setParams_ you can **update** the title of the 'Settings' view to a specific language. Note that we're passing _newLang_ as an extra parameter to force the translation function to use the newly chosen language.
```js
// ../Containers/SettingsContainer.js
_languageChanged = (changeLanguage, setParams) => (newLang) => {
  changeLanguage(newLang)
  // Add this:
  setParams({
    title: I18n.t('settings.title', { locale: newLang }) // switch language of the 'Settings' view's title
  })
}
```

# Sample

A sample project with the multi-language setup as described above can be found [here](https://github.com/appfoundry/react-native-multi-language-sample/tree/master/MultiLangSampleApp).

# Summary

An app that can adjust its language to the target system, and gives users the possibility to switch languages, increases the accessibility of the app. Such an app will be ranked higher in the app stores and consequently gain more attention of the smartphone users than an app with a fixed language. I hope this blog post has been informative enough to show you how to implement this in React Native apps and helps you getting your app out there!


## License

This project is licensed under the terms of the MIT license. See the [LICENSE](LICENSE) file.
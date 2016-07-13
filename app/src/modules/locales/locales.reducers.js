import {fromJS} from 'immutable';

import {SET_LANG} from './locales.actions';

import en from '../../translations/en.json';
import {unpath} from '../utils';

export const DEFAULT_LANG = 'en';

const translations = {en};

const initialState = fromJS({
  lang: DEFAULT_LANG,
  messages: unpath(translations[DEFAULT_LANG])
});

export function localesReducer(state = initialState, {type, payload}) {
  switch (type) {
    case SET_LANG:
      return state.merge({
        lang: payload,
        messages: translations[payload]
      });
    default:
      return state;
  }
}

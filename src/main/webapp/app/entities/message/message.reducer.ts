import axios from 'axios';
import { ICrudSearchAction, ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { IMessage, defaultValue } from 'app/shared/model/message.model';

export const ACTION_TYPES = {
  SEARCH_MESSAGES: 'message/SEARCH_MESSAGES',
  FETCH_MESSAGE_LIST: 'message/FETCH_MESSAGE_LIST',
  FETCH_MESSAGE: 'message/FETCH_MESSAGE',
  CREATE_MESSAGE: 'message/CREATE_MESSAGE',
  UPDATE_MESSAGE: 'message/UPDATE_MESSAGE',
  DELETE_MESSAGE: 'message/DELETE_MESSAGE',
  SET_BLOB: 'message/SET_BLOB',
  RESET: 'message/RESET',
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<IMessage>,
  entity: defaultValue,
  updating: false,
  totalItems: 0,
  updateSuccess: false,
};

export type MessageState = Readonly<typeof initialState>;

// Reducer

export default (state: MessageState = initialState, action): MessageState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.SEARCH_MESSAGES):
    case REQUEST(ACTION_TYPES.FETCH_MESSAGE_LIST):
    case REQUEST(ACTION_TYPES.FETCH_MESSAGE):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true,
      };
    case REQUEST(ACTION_TYPES.CREATE_MESSAGE):
    case REQUEST(ACTION_TYPES.UPDATE_MESSAGE):
    case REQUEST(ACTION_TYPES.DELETE_MESSAGE):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true,
      };
    case FAILURE(ACTION_TYPES.SEARCH_MESSAGES):
    case FAILURE(ACTION_TYPES.FETCH_MESSAGE_LIST):
    case FAILURE(ACTION_TYPES.FETCH_MESSAGE):
    case FAILURE(ACTION_TYPES.CREATE_MESSAGE):
    case FAILURE(ACTION_TYPES.UPDATE_MESSAGE):
    case FAILURE(ACTION_TYPES.DELETE_MESSAGE):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload,
      };
    case SUCCESS(ACTION_TYPES.SEARCH_MESSAGES):
    case SUCCESS(ACTION_TYPES.FETCH_MESSAGE_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
        totalItems: parseInt(action.payload.headers['x-total-count'], 10),
      };
    case SUCCESS(ACTION_TYPES.FETCH_MESSAGE):
      return {
        ...state,
        loading: false,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.CREATE_MESSAGE):
    case SUCCESS(ACTION_TYPES.UPDATE_MESSAGE):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.DELETE_MESSAGE):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: {},
      };
    case ACTION_TYPES.SET_BLOB: {
      const { name, data, contentType } = action.payload;
      return {
        ...state,
        entity: {
          ...state.entity,
          [name]: data,
          [name + 'ContentType']: contentType,
        },
      };
    }
    case ACTION_TYPES.RESET:
      return {
        ...initialState,
      };
    default:
      return state;
  }
};

const apiUrl = 'api/messages';
const apiSearchUrl = 'api/_search/messages';

// Actions

export const getSearchEntities: ICrudSearchAction<IMessage> = (query, page, size, sort) => ({
  type: ACTION_TYPES.SEARCH_MESSAGES,
  payload: axios.get<IMessage>(`${apiSearchUrl}?query=${query}${sort ? `&page=${page}&size=${size}&sort=${sort}` : ''}`),
});

export const getEntities: ICrudGetAllAction<IMessage> = (page, size, sort) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_MESSAGE_LIST,
    payload: axios.get<IMessage>(`${requestUrl}${sort ? '&' : '?'}cacheBuster=${new Date().getTime()}`),
  };
};

export const getEntity: ICrudGetAction<IMessage> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_MESSAGE,
    payload: axios.get<IMessage>(requestUrl),
  };
};

export const createEntity: ICrudPutAction<IMessage> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_MESSAGE,
    payload: axios.post(apiUrl, cleanEntity(entity)),
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<IMessage> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_MESSAGE,
    payload: axios.put(apiUrl, cleanEntity(entity)),
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<IMessage> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_MESSAGE,
    payload: axios.delete(requestUrl),
  });
  dispatch(getEntities());
  return result;
};

export const setBlob = (name, data, contentType?) => ({
  type: ACTION_TYPES.SET_BLOB,
  payload: {
    name,
    data,
    contentType,
  },
});

export const reset = () => ({
  type: ACTION_TYPES.RESET,
});

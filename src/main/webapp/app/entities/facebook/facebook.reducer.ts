import axios from 'axios';
import { ICrudSearchAction, ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { IFacebook, defaultValue } from 'app/shared/model/facebook.model';

export const ACTION_TYPES = {
  SEARCH_FACEBOOKS: 'facebook/SEARCH_FACEBOOKS',
  FETCH_FACEBOOK_LIST: 'facebook/FETCH_FACEBOOK_LIST',
  FETCH_FACEBOOK: 'facebook/FETCH_FACEBOOK',
  CREATE_FACEBOOK: 'facebook/CREATE_FACEBOOK',
  UPDATE_FACEBOOK: 'facebook/UPDATE_FACEBOOK',
  DELETE_FACEBOOK: 'facebook/DELETE_FACEBOOK',
  RESET: 'facebook/RESET',
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<IFacebook>,
  entity: defaultValue,
  updating: false,
  totalItems: 0,
  updateSuccess: false,
};

export type FacebookState = Readonly<typeof initialState>;

// Reducer

export default (state: FacebookState = initialState, action): FacebookState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.SEARCH_FACEBOOKS):
    case REQUEST(ACTION_TYPES.FETCH_FACEBOOK_LIST):
    case REQUEST(ACTION_TYPES.FETCH_FACEBOOK):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true,
      };
    case REQUEST(ACTION_TYPES.CREATE_FACEBOOK):
    case REQUEST(ACTION_TYPES.UPDATE_FACEBOOK):
    case REQUEST(ACTION_TYPES.DELETE_FACEBOOK):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true,
      };
    case FAILURE(ACTION_TYPES.SEARCH_FACEBOOKS):
    case FAILURE(ACTION_TYPES.FETCH_FACEBOOK_LIST):
    case FAILURE(ACTION_TYPES.FETCH_FACEBOOK):
    case FAILURE(ACTION_TYPES.CREATE_FACEBOOK):
    case FAILURE(ACTION_TYPES.UPDATE_FACEBOOK):
    case FAILURE(ACTION_TYPES.DELETE_FACEBOOK):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload,
      };
    case SUCCESS(ACTION_TYPES.SEARCH_FACEBOOKS):
    case SUCCESS(ACTION_TYPES.FETCH_FACEBOOK_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
        totalItems: parseInt(action.payload.headers['x-total-count'], 10),
      };
    case SUCCESS(ACTION_TYPES.FETCH_FACEBOOK):
      return {
        ...state,
        loading: false,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.CREATE_FACEBOOK):
    case SUCCESS(ACTION_TYPES.UPDATE_FACEBOOK):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.DELETE_FACEBOOK):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: {},
      };
    case ACTION_TYPES.RESET:
      return {
        ...initialState,
      };
    default:
      return state;
  }
};

const apiUrl = 'api/facebooks';
const apiSearchUrl = 'api/_search/facebooks';

// Actions

export const getSearchEntities: ICrudSearchAction<IFacebook> = (query, page, size, sort) => ({
  type: ACTION_TYPES.SEARCH_FACEBOOKS,
  payload: axios.get<IFacebook>(`${apiSearchUrl}?query=${query}${sort ? `&page=${page}&size=${size}&sort=${sort}` : ''}`),
});

export const getEntities: ICrudGetAllAction<IFacebook> = (page, size, sort) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_FACEBOOK_LIST,
    payload: axios.get<IFacebook>(`${requestUrl}${sort ? '&' : '?'}cacheBuster=${new Date().getTime()}`),
  };
};

export const getEntity: ICrudGetAction<IFacebook> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_FACEBOOK,
    payload: axios.get<IFacebook>(requestUrl),
  };
};

export const createEntity: ICrudPutAction<IFacebook> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_FACEBOOK,
    payload: axios.post(apiUrl, cleanEntity(entity)),
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<IFacebook> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_FACEBOOK,
    payload: axios.put(apiUrl, cleanEntity(entity)),
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<IFacebook> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_FACEBOOK,
    payload: axios.delete(requestUrl),
  });
  dispatch(getEntities());
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET,
});

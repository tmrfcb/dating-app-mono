import axios from 'axios';
import {
  ICrudSearchAction,
  parseHeaderForLinks,
  loadMoreDataWhenScrolled,
  ICrudGetAction,
  ICrudGetAllAction,
  ICrudPutAction,
  ICrudDeleteAction,
} from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { IUserApp, defaultValue } from 'app/shared/model/user-app.model';

export const ACTION_TYPES = {
  SEARCH_USERAPPS: 'userApp/SEARCH_USERAPPS',
  FETCH_USERAPP_LIST: 'userApp/FETCH_USERAPP_LIST',
  FETCH_USERAPP: 'userApp/FETCH_USERAPP',
  CREATE_USERAPP: 'userApp/CREATE_USERAPP',
  UPDATE_USERAPP: 'userApp/UPDATE_USERAPP',
  DELETE_USERAPP: 'userApp/DELETE_USERAPP',
  RESET: 'userApp/RESET',
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<IUserApp>,
  entity: defaultValue,
  links: { next: 0 },
  updating: false,
  totalItems: 0,
  updateSuccess: false,
};

export type UserAppState = Readonly<typeof initialState>;

// Reducer

export default (state: UserAppState = initialState, action): UserAppState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.SEARCH_USERAPPS):
    case REQUEST(ACTION_TYPES.FETCH_USERAPP_LIST):
    case REQUEST(ACTION_TYPES.FETCH_USERAPP):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true,
      };
    case REQUEST(ACTION_TYPES.CREATE_USERAPP):
    case REQUEST(ACTION_TYPES.UPDATE_USERAPP):
    case REQUEST(ACTION_TYPES.DELETE_USERAPP):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true,
      };
    case FAILURE(ACTION_TYPES.SEARCH_USERAPPS):
    case FAILURE(ACTION_TYPES.FETCH_USERAPP_LIST):
    case FAILURE(ACTION_TYPES.FETCH_USERAPP):
    case FAILURE(ACTION_TYPES.CREATE_USERAPP):
    case FAILURE(ACTION_TYPES.UPDATE_USERAPP):
    case FAILURE(ACTION_TYPES.DELETE_USERAPP):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload,
      };
    case SUCCESS(ACTION_TYPES.SEARCH_USERAPPS):
    case SUCCESS(ACTION_TYPES.FETCH_USERAPP_LIST): {
      const links = parseHeaderForLinks(action.payload.headers.link);

      return {
        ...state,
        loading: false,
        links,
        entities: loadMoreDataWhenScrolled(state.entities, action.payload.data, links),
        totalItems: parseInt(action.payload.headers['x-total-count'], 10),
      };
    }
    case SUCCESS(ACTION_TYPES.FETCH_USERAPP):
      return {
        ...state,
        loading: false,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.CREATE_USERAPP):
    case SUCCESS(ACTION_TYPES.UPDATE_USERAPP):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.DELETE_USERAPP):
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

const apiUrl = 'api/user-apps';
const apiSearchUrl = 'api/_search/user-apps';

// Actions

export const getSearchEntities: ICrudSearchAction<IUserApp> = (query, page, size, sort) => ({
  type: ACTION_TYPES.SEARCH_USERAPPS,
  payload: axios.get<IUserApp>(`${apiSearchUrl}?query=${query}${sort ? `&page=${page}&size=${size}&sort=${sort}` : ''}`),
});

export const getEntities: ICrudGetAllAction<IUserApp> = (page, size, sort) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_USERAPP_LIST,
    payload: axios.get<IUserApp>(`${requestUrl}${sort ? '&' : '?'}cacheBuster=${new Date().getTime()}`),
  };
};

export const getEntity: ICrudGetAction<IUserApp> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_USERAPP,
    payload: axios.get<IUserApp>(requestUrl),
  };
};

export const createEntity: ICrudPutAction<IUserApp> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_USERAPP,
    payload: axios.post(apiUrl, cleanEntity(entity)),
  });
  return result;
};

export const updateEntity: ICrudPutAction<IUserApp> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_USERAPP,
    payload: axios.put(apiUrl, cleanEntity(entity)),
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<IUserApp> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_USERAPP,
    payload: axios.delete(requestUrl),
  });
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET,
});

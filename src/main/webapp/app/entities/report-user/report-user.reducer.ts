import axios from 'axios';
import { ICrudSearchAction, ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { IReportUser, defaultValue } from 'app/shared/model/report-user.model';

export const ACTION_TYPES = {
  SEARCH_REPORTUSERS: 'reportUser/SEARCH_REPORTUSERS',
  FETCH_REPORTUSER_LIST: 'reportUser/FETCH_REPORTUSER_LIST',
  FETCH_REPORTUSER: 'reportUser/FETCH_REPORTUSER',
  CREATE_REPORTUSER: 'reportUser/CREATE_REPORTUSER',
  UPDATE_REPORTUSER: 'reportUser/UPDATE_REPORTUSER',
  DELETE_REPORTUSER: 'reportUser/DELETE_REPORTUSER',
  SET_BLOB: 'reportUser/SET_BLOB',
  RESET: 'reportUser/RESET',
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<IReportUser>,
  entity: defaultValue,
  updating: false,
  totalItems: 0,
  updateSuccess: false,
};

export type ReportUserState = Readonly<typeof initialState>;

// Reducer

export default (state: ReportUserState = initialState, action): ReportUserState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.SEARCH_REPORTUSERS):
    case REQUEST(ACTION_TYPES.FETCH_REPORTUSER_LIST):
    case REQUEST(ACTION_TYPES.FETCH_REPORTUSER):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true,
      };
    case REQUEST(ACTION_TYPES.CREATE_REPORTUSER):
    case REQUEST(ACTION_TYPES.UPDATE_REPORTUSER):
    case REQUEST(ACTION_TYPES.DELETE_REPORTUSER):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true,
      };
    case FAILURE(ACTION_TYPES.SEARCH_REPORTUSERS):
    case FAILURE(ACTION_TYPES.FETCH_REPORTUSER_LIST):
    case FAILURE(ACTION_TYPES.FETCH_REPORTUSER):
    case FAILURE(ACTION_TYPES.CREATE_REPORTUSER):
    case FAILURE(ACTION_TYPES.UPDATE_REPORTUSER):
    case FAILURE(ACTION_TYPES.DELETE_REPORTUSER):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload,
      };
    case SUCCESS(ACTION_TYPES.SEARCH_REPORTUSERS):
    case SUCCESS(ACTION_TYPES.FETCH_REPORTUSER_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
        totalItems: parseInt(action.payload.headers['x-total-count'], 10),
      };
    case SUCCESS(ACTION_TYPES.FETCH_REPORTUSER):
      return {
        ...state,
        loading: false,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.CREATE_REPORTUSER):
    case SUCCESS(ACTION_TYPES.UPDATE_REPORTUSER):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.DELETE_REPORTUSER):
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

const apiUrl = 'api/report-users';
const apiSearchUrl = 'api/_search/report-users';

// Actions

export const getSearchEntities: ICrudSearchAction<IReportUser> = (query, page, size, sort) => ({
  type: ACTION_TYPES.SEARCH_REPORTUSERS,
  payload: axios.get<IReportUser>(`${apiSearchUrl}?query=${query}${sort ? `&page=${page}&size=${size}&sort=${sort}` : ''}`),
});

export const getEntities: ICrudGetAllAction<IReportUser> = (page, size, sort) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_REPORTUSER_LIST,
    payload: axios.get<IReportUser>(`${requestUrl}${sort ? '&' : '?'}cacheBuster=${new Date().getTime()}`),
  };
};

export const getEntity: ICrudGetAction<IReportUser> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_REPORTUSER,
    payload: axios.get<IReportUser>(requestUrl),
  };
};

export const createEntity: ICrudPutAction<IReportUser> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_REPORTUSER,
    payload: axios.post(apiUrl, cleanEntity(entity)),
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<IReportUser> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_REPORTUSER,
    payload: axios.put(apiUrl, cleanEntity(entity)),
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<IReportUser> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_REPORTUSER,
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

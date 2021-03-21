import axios from 'axios';
import { ICrudSearchAction, ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { IUnmatchRelation, defaultValue } from 'app/shared/model/unmatch-relation.model';

export const ACTION_TYPES = {
  SEARCH_UNMATCHRELATIONS: 'unmatchRelation/SEARCH_UNMATCHRELATIONS',
  FETCH_UNMATCHRELATION_LIST: 'unmatchRelation/FETCH_UNMATCHRELATION_LIST',
  FETCH_UNMATCHRELATION: 'unmatchRelation/FETCH_UNMATCHRELATION',
  CREATE_UNMATCHRELATION: 'unmatchRelation/CREATE_UNMATCHRELATION',
  UPDATE_UNMATCHRELATION: 'unmatchRelation/UPDATE_UNMATCHRELATION',
  DELETE_UNMATCHRELATION: 'unmatchRelation/DELETE_UNMATCHRELATION',
  RESET: 'unmatchRelation/RESET',
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<IUnmatchRelation>,
  entity: defaultValue,
  updating: false,
  totalItems: 0,
  updateSuccess: false,
};

export type UnmatchRelationState = Readonly<typeof initialState>;

// Reducer

export default (state: UnmatchRelationState = initialState, action): UnmatchRelationState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.SEARCH_UNMATCHRELATIONS):
    case REQUEST(ACTION_TYPES.FETCH_UNMATCHRELATION_LIST):
    case REQUEST(ACTION_TYPES.FETCH_UNMATCHRELATION):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true,
      };
    case REQUEST(ACTION_TYPES.CREATE_UNMATCHRELATION):
    case REQUEST(ACTION_TYPES.UPDATE_UNMATCHRELATION):
    case REQUEST(ACTION_TYPES.DELETE_UNMATCHRELATION):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true,
      };
    case FAILURE(ACTION_TYPES.SEARCH_UNMATCHRELATIONS):
    case FAILURE(ACTION_TYPES.FETCH_UNMATCHRELATION_LIST):
    case FAILURE(ACTION_TYPES.FETCH_UNMATCHRELATION):
    case FAILURE(ACTION_TYPES.CREATE_UNMATCHRELATION):
    case FAILURE(ACTION_TYPES.UPDATE_UNMATCHRELATION):
    case FAILURE(ACTION_TYPES.DELETE_UNMATCHRELATION):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload,
      };
    case SUCCESS(ACTION_TYPES.SEARCH_UNMATCHRELATIONS):
    case SUCCESS(ACTION_TYPES.FETCH_UNMATCHRELATION_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
        totalItems: parseInt(action.payload.headers['x-total-count'], 10),
      };
    case SUCCESS(ACTION_TYPES.FETCH_UNMATCHRELATION):
      return {
        ...state,
        loading: false,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.CREATE_UNMATCHRELATION):
    case SUCCESS(ACTION_TYPES.UPDATE_UNMATCHRELATION):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.DELETE_UNMATCHRELATION):
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

const apiUrl = 'api/unmatch-relations';
const apiSearchUrl = 'api/_search/unmatch-relations';

// Actions

export const getSearchEntities: ICrudSearchAction<IUnmatchRelation> = (query, page, size, sort) => ({
  type: ACTION_TYPES.SEARCH_UNMATCHRELATIONS,
  payload: axios.get<IUnmatchRelation>(`${apiSearchUrl}?query=${query}${sort ? `&page=${page}&size=${size}&sort=${sort}` : ''}`),
});

export const getEntities: ICrudGetAllAction<IUnmatchRelation> = (page, size, sort) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_UNMATCHRELATION_LIST,
    payload: axios.get<IUnmatchRelation>(`${requestUrl}${sort ? '&' : '?'}cacheBuster=${new Date().getTime()}`),
  };
};

export const getEntity: ICrudGetAction<IUnmatchRelation> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_UNMATCHRELATION,
    payload: axios.get<IUnmatchRelation>(requestUrl),
  };
};

export const createEntity: ICrudPutAction<IUnmatchRelation> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_UNMATCHRELATION,
    payload: axios.post(apiUrl, cleanEntity(entity)),
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<IUnmatchRelation> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_UNMATCHRELATION,
    payload: axios.put(apiUrl, cleanEntity(entity)),
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<IUnmatchRelation> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_UNMATCHRELATION,
    payload: axios.delete(requestUrl),
  });
  dispatch(getEntities());
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET,
});

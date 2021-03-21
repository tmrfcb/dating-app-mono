import axios from 'axios';
import { ICrudSearchAction, ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { IRelation, defaultValue } from 'app/shared/model/relation.model';

export const ACTION_TYPES = {
  SEARCH_RELATIONS: 'relation/SEARCH_RELATIONS',
  FETCH_RELATION_LIST: 'relation/FETCH_RELATION_LIST',
  FETCH_RELATION: 'relation/FETCH_RELATION',
  CREATE_RELATION: 'relation/CREATE_RELATION',
  UPDATE_RELATION: 'relation/UPDATE_RELATION',
  DELETE_RELATION: 'relation/DELETE_RELATION',
  RESET: 'relation/RESET',
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<IRelation>,
  entity: defaultValue,
  updating: false,
  totalItems: 0,
  updateSuccess: false,
};

export type RelationState = Readonly<typeof initialState>;

// Reducer

export default (state: RelationState = initialState, action): RelationState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.SEARCH_RELATIONS):
    case REQUEST(ACTION_TYPES.FETCH_RELATION_LIST):
    case REQUEST(ACTION_TYPES.FETCH_RELATION):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true,
      };
    case REQUEST(ACTION_TYPES.CREATE_RELATION):
    case REQUEST(ACTION_TYPES.UPDATE_RELATION):
    case REQUEST(ACTION_TYPES.DELETE_RELATION):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true,
      };
    case FAILURE(ACTION_TYPES.SEARCH_RELATIONS):
    case FAILURE(ACTION_TYPES.FETCH_RELATION_LIST):
    case FAILURE(ACTION_TYPES.FETCH_RELATION):
    case FAILURE(ACTION_TYPES.CREATE_RELATION):
    case FAILURE(ACTION_TYPES.UPDATE_RELATION):
    case FAILURE(ACTION_TYPES.DELETE_RELATION):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload,
      };
    case SUCCESS(ACTION_TYPES.SEARCH_RELATIONS):
    case SUCCESS(ACTION_TYPES.FETCH_RELATION_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
        totalItems: parseInt(action.payload.headers['x-total-count'], 10),
      };
    case SUCCESS(ACTION_TYPES.FETCH_RELATION):
      return {
        ...state,
        loading: false,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.CREATE_RELATION):
    case SUCCESS(ACTION_TYPES.UPDATE_RELATION):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.DELETE_RELATION):
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

const apiUrl = 'api/relations';
const apiSearchUrl = 'api/_search/relations';

// Actions

export const getSearchEntities: ICrudSearchAction<IRelation> = (query, page, size, sort) => ({
  type: ACTION_TYPES.SEARCH_RELATIONS,
  payload: axios.get<IRelation>(`${apiSearchUrl}?query=${query}${sort ? `&page=${page}&size=${size}&sort=${sort}` : ''}`),
});

export const getEntities: ICrudGetAllAction<IRelation> = (page, size, sort) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_RELATION_LIST,
    payload: axios.get<IRelation>(`${requestUrl}${sort ? '&' : '?'}cacheBuster=${new Date().getTime()}`),
  };
};

export const getEntity: ICrudGetAction<IRelation> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_RELATION,
    payload: axios.get<IRelation>(requestUrl),
  };
};

export const createEntity: ICrudPutAction<IRelation> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_RELATION,
    payload: axios.post(apiUrl, cleanEntity(entity)),
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<IRelation> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_RELATION,
    payload: axios.put(apiUrl, cleanEntity(entity)),
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<IRelation> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_RELATION,
    payload: axios.delete(requestUrl),
  });
  dispatch(getEntities());
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET,
});

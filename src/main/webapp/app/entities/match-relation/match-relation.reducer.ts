import axios from 'axios';
import { ICrudSearchAction, ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { IMatchRelation, defaultValue } from 'app/shared/model/match-relation.model';

export const ACTION_TYPES = {
  SEARCH_MATCHRELATIONS: 'matchRelation/SEARCH_MATCHRELATIONS',
  FETCH_MATCHRELATION_LIST: 'matchRelation/FETCH_MATCHRELATION_LIST',
  FETCH_MATCHRELATION: 'matchRelation/FETCH_MATCHRELATION',
  CREATE_MATCHRELATION: 'matchRelation/CREATE_MATCHRELATION',
  UPDATE_MATCHRELATION: 'matchRelation/UPDATE_MATCHRELATION',
  DELETE_MATCHRELATION: 'matchRelation/DELETE_MATCHRELATION',
  RESET: 'matchRelation/RESET',
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<IMatchRelation>,
  entity: defaultValue,
  updating: false,
  totalItems: 0,
  updateSuccess: false,
};

export type MatchRelationState = Readonly<typeof initialState>;

// Reducer

export default (state: MatchRelationState = initialState, action): MatchRelationState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.SEARCH_MATCHRELATIONS):
    case REQUEST(ACTION_TYPES.FETCH_MATCHRELATION_LIST):
    case REQUEST(ACTION_TYPES.FETCH_MATCHRELATION):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true,
      };
    case REQUEST(ACTION_TYPES.CREATE_MATCHRELATION):
    case REQUEST(ACTION_TYPES.UPDATE_MATCHRELATION):
    case REQUEST(ACTION_TYPES.DELETE_MATCHRELATION):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true,
      };
    case FAILURE(ACTION_TYPES.SEARCH_MATCHRELATIONS):
    case FAILURE(ACTION_TYPES.FETCH_MATCHRELATION_LIST):
    case FAILURE(ACTION_TYPES.FETCH_MATCHRELATION):
    case FAILURE(ACTION_TYPES.CREATE_MATCHRELATION):
    case FAILURE(ACTION_TYPES.UPDATE_MATCHRELATION):
    case FAILURE(ACTION_TYPES.DELETE_MATCHRELATION):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload,
      };
    case SUCCESS(ACTION_TYPES.SEARCH_MATCHRELATIONS):
    case SUCCESS(ACTION_TYPES.FETCH_MATCHRELATION_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
        totalItems: parseInt(action.payload.headers['x-total-count'], 10),
      };
    case SUCCESS(ACTION_TYPES.FETCH_MATCHRELATION):
      return {
        ...state,
        loading: false,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.CREATE_MATCHRELATION):
    case SUCCESS(ACTION_TYPES.UPDATE_MATCHRELATION):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.DELETE_MATCHRELATION):
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

const apiUrl = 'api/match-relations';
const apiSearchUrl = 'api/_search/match-relations';

// Actions

export const getSearchEntities: ICrudSearchAction<IMatchRelation> = (query, page, size, sort) => ({
  type: ACTION_TYPES.SEARCH_MATCHRELATIONS,
  payload: axios.get<IMatchRelation>(`${apiSearchUrl}?query=${query}${sort ? `&page=${page}&size=${size}&sort=${sort}` : ''}`),
});

export const getEntities: ICrudGetAllAction<IMatchRelation> = (page, size, sort) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_MATCHRELATION_LIST,
    payload: axios.get<IMatchRelation>(`${requestUrl}${sort ? '&' : '?'}cacheBuster=${new Date().getTime()}`),
  };
};

export const getEntity: ICrudGetAction<IMatchRelation> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_MATCHRELATION,
    payload: axios.get<IMatchRelation>(requestUrl),
  };
};

export const createEntity: ICrudPutAction<IMatchRelation> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_MATCHRELATION,
    payload: axios.post(apiUrl, cleanEntity(entity)),
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<IMatchRelation> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_MATCHRELATION,
    payload: axios.put(apiUrl, cleanEntity(entity)),
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<IMatchRelation> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_MATCHRELATION,
    payload: axios.delete(requestUrl),
  });
  dispatch(getEntities());
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET,
});

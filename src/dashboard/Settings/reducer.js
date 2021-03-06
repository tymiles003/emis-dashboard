import {
  FETCH_INCIDENTS_TYPE_SUCCESS,
  SELECT_INCIDENT_TYPE,
  FETCH_INCIDENTS_TYPE_START,
  UPDATE_INCIDENT_TYPE,
  SELECT_COLOR_AUTOFILL,
  FETCH_INCIDENT_TYPE_FAILURE,
  SELECT_ACTIVE_MENU,
} from './actions';

/**
 * Incident reducers
 *
 * @function
 * @name IncidentsType
 *
 * @param {Object} state - Initial state
 * @param {Object} action - Redux action object
 * @param {string} action.type - Action type
 *
 * @version 0.1.0
 * @since 0.1.0
 * */

const initialState = {
  filters: [],
  data: [],
  total: 0,
  page: 1,
  isLoading: false,
  error: null,
};

export function incidentsType(state = initialState, action) {
  switch (action.type) {
    case FETCH_INCIDENTS_TYPE_START:
      return {
        state,
        isLoading: true,
        error: null,
        total: 0,
      };

    case FETCH_INCIDENTS_TYPE_SUCCESS:
      return {
        data: action.payload.data.data,
        total: action.payload.data.total,
        page: action.payload.data.page,
        isLoading: false,
        error: null,
        incidentType: action.payload.data.data[0],
      };
    case FETCH_INCIDENT_TYPE_FAILURE:
      return {
        data: [],
        isLoading: false,
        error: action.payload,
      };

    case SELECT_INCIDENT_TYPE:
      return {
        ...state,
        incidentType: action.payload.incidentSelected,
      };

    case UPDATE_INCIDENT_TYPE: {
      const data = [...state.data];
      const incidentType = action.update;
      const id = action.incidentTypeId;
      const index = data.findIndex(({ _id }) => _id === id);
      data[index] = incidentType;
      return {
        ...state,
        data,
        incidentType,
      };
    }

    case SELECT_COLOR_AUTOFILL:
      return {
        ...state,
        colorSelected: action.payload.colorSelected,
      };

    default:
      return state;
  }
}

export function activeMenu(state = { activeItem: 'incidentType' }, action) {
  switch (action.type) {
    case SELECT_ACTIVE_MENU:
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
}

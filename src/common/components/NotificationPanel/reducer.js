import { SHOW_NOTIFICATION_PANEL, CLOSE_NOTIFICATION_PANEL } from './actions';

/**
 * Reducer to control the display of the
 * message panel
 * @param {Object} state - redux state
 * @param {Object} action - redux action
 */
const showNotificationPanel = (state = false, action) => {
  switch (action.type) {
    case SHOW_NOTIFICATION_PANEL:
      return true;
    case CLOSE_NOTIFICATION_PANEL:
      return false;
    default:
      return state;
  }
};

export default showNotificationPanel;

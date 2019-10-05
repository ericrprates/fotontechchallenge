import reducers from '../constants/reducers';

const INITAL_STATE = {
  isAuthenticated: false,
  profile: {},
  token: null
};

export default (state = INITAL_STATE, action) => {
  switch (action.type) {
    case reducers.user.signIn:
      return {
        ...state,
        isAuthenticated: true,
        user: action.user,
        token: action.token
      };
    case reducers.user.signOut:
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        token: null
      };
    case reducers.user.signUp:
      return {
        ...state,
        isAuthenticated: true,
        user: action.user,
        token: action.token
      };
    default:
      return state;
  }
};

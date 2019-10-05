import reducers from '../constants/reducers';

const INITAL_STATE = { data: [] };

export default (state = INITAL_STATE, action) => {
  switch (action.type) {
    case reducers.products.list:
      return {
        ...state,
        data: action.products
      };
    case reducers.products.create:
      return { ...state, data: [...state.data, action.product] };
    case reducers.products.update: {
      let products = [...state.data];
      products.map(product =>
        product._id === action.product ? action.product : product
      );
      return { ...state, data: products };
    }
    case reducers.products.delete: {
      let products = [...state.data];
      products = products.filter(product => {
        return product._id !== action.product._id;
      });

      return { ...state, data: products };
    }
    default:
      return state;
  }
};

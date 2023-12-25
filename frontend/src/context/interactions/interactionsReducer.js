const interactionsReducer = (state, action) => {
  switch (action.type) {
    case 'GET_INTERACTIONS':
      return {
        interactions: action.payload.data,
        pagination: action.payload.pagination,
      };

    case 'GET_INTERACTIONS_NEXT':
      return {
        interactions: [...state.interactions, ...action.payload.data],
        pagination: action.payload.pagination,
      };

    default:
      return state;
  }
};

export default interactionsReducer;

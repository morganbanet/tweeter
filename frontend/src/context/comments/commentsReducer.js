const commentsReducer = (state, action) => {
  switch (action.type) {
    case 'GET_COMMENTS':
      return {
        comments: action.payload.data,
        pagination: action.payload.pagination,
      };

    case 'GET_COMMENTS_NEXT':
      return {
        comments: [...state.comments, ...action.payload.data],
        pagination: action.payload.pagination,
      };

    case 'CREATE_COMMENT':
      let commentsAtCreate;
      let nextPageAtCreate;

      if (state.comments.length % 5 === 0) {
        commentsAtCreate = [action.payload, ...state.comments.slice(0, -1)];
        nextPageAtCreate = state.pagination.current.page + 1;
      } else {
        commentsAtCreate = [action.payload, ...state.comments];
      }

      return {
        comments: commentsAtCreate,
        pagination: { ...state.pagination, next: { page: nextPageAtCreate } },
      };

    case 'DELETE_COMMENT':
      const currPage =
        state.comments.length % 5 === 1
          ? state.pagination.current.page - 1
          : state.pagination.current.page;

      // adjust page offset caused by delete
      const nextPageAtDelete =
        state.comments.length % 5 === 0
          ? state.pagination.current.page + 1
          : state.pagination.current.page;

      const commentsAtDelete = [
        ...state.comments.filter(
          (comment) => comment._id !== action.payload.commentId
        ),
        ...action.payload.toAppend,
      ];

      return {
        comments: commentsAtDelete,
        pagination: {
          ...state.pagination,
          current: { page: currPage },
          next: { page: nextPageAtDelete },
        },
      };

    default: {
      return state;
    }
  }
};

export default commentsReducer;

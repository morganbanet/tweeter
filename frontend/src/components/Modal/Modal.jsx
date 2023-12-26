import { useState, useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useGetInteractions } from '../../hooks/interactions/useGetInteractions';
import { useInteractionsContext } from '../../hooks/interactions/useInteractionsContext';
import { defaultAvatar } from '../../utils/defaults';
import ModalItem from '../ModalItem/ModalItem';

function Modal({ setModalIsOpen, id, resType, targetOne }) {
  const [togglePage, setTogglePage] = useState(false);
  const [page, setPage] = useState(1);

  const { getInteractions, isLoading, error } = useGetInteractions();
  const { interactions: users, pagination } = useInteractionsContext();

  useEffect(() => {
    const fetchInteractions = async () => {
      await getInteractions(id, resType, targetOne, page);
    };
    fetchInteractions();
  }, [page, togglePage]);

  const handlePagination = () => {
    setPage(pagination.next.page);
    setTogglePage(!togglePage);
  };

  let interactedText;
  if (targetOne === 'comments') interactedText = 'commented on';
  if (targetOne === 'likes') interactedText = 'liked';
  if (targetOne === 'retweets') interactedText = 'retweeted';
  if (targetOne === 'bookmarks') interactedText = 'saved';

  const interactedType =
    resType === 'tweets'
      ? `${resType[0].toUpperCase()}${resType.slice(1, -1)}`
      : resType.toLowerCase().slice(0, -1);

  return (
    <>
      <div className="modal-screen">
        <div className="modal-container">
          <div className="modal-header">
            <h2>
              Users who {interactedText} this {interactedType}
            </h2>

            <span
              onClick={() => setModalIsOpen(false)}
              className="material-symbols-outlined"
            >
              close
            </span>
          </div>

          <div id="items" className="items">
            <InfiniteScroll
              dataLength={users.length}
              next={handlePagination}
              hasMore={pagination?.next?.page ? true : false}
              loader={<h4>Loading...</h4>}
              scrollableTarget="items"
            >
              {!isLoading &&
                users.map((user) => <ModalItem key={user._id} user={user} />)}
            </InfiniteScroll>
          </div>
        </div>
      </div>

      <div className="modal-layer" onClick={() => setModalIsOpen(false)} />
    </>
  );
}

export default Modal;

function TweetFormDropdown({ setIsPrivate }) {
  return (
    <div className="tweet-form-dropdown">
      <p className="heading">Who can reply?</p>
      <p className="subheading">Choose who can reply to this Tweet.</p>

      <div className="privacy-items">
        <div onClick={() => setIsPrivate(false)}>
          <div>
            <span className="material-symbols-outlined">public</span>
          </div>
          <p>Everyone</p>
        </div>

        <div onClick={() => setIsPrivate(true)}>
          <div>
            <i className="fa-solid fa-user-group" />
          </div>
          <p>People you follow</p>
        </div>
      </div>
    </div>
  );
}

export default TweetFormDropdown;

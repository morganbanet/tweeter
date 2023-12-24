function Modal({ text, setModalIsOpen }) {
  return (
    <>
      <div className="modal-screen">
        <div className="modal-container">
          <div className="modal-header">
            <h2>Daniel Jesnsen is following</h2>
            <span
              onClick={() => setModalIsOpen(false)}
              className="material-symbols-outlined"
            >
              close
            </span>
          </div>

          <div className="items">
            <div className="item">
              <div className="item-header">
                <div className="user-info">
                  <div className="avatar">
                    <img
                      src="https://firebasestorage.googleapis.com/v0/b/tweeter-90ee8.appspot.com/o/defaults%2Ftweeter_defaults_avatar.jpg?alt=media&token=a0283e0a-3511-458a-8f8b-ae80d37b2ac1"
                      alt="user avatar"
                    />
                  </div>

                  <div className="username-followers">
                    <h3>Austin Neill</h3>
                    <p>120k followers</p>
                  </div>
                </div>

                <span>Follow</span>
              </div>

              <div className="bio">
                <p>
                  @jjonthan on Instagram **Over a decade as a lifestyle,
                  adventure, and studio photographer. Traveling with my wife
                  @travelfoodlove on instagram. PLEASE LINK ALL PHOTOS TO
                  jonathangallegos.com -- not required but much appreciated!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="modal-layer" onClick={() => setModalIsOpen(false)} />
    </>
  );
}

export default Modal;

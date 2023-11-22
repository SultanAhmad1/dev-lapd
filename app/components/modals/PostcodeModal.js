import React from 'react'

function PostcodeModal() {
    return (
        <div className="deliver-to-body-content">
            <h1 className="deliver-to-body-content-h1">
                Deliver to
            </h1>
            <div className="deliver-to-body-content-nested-div-level-one">
                <label
                id="location-typeahead-location-manager-label"
                htmlFor="location-typeahead-location-manager-input"
                className="deliver-to-body-content-nested-div-level-one-label"
                >
                    When autocomplete results are available, use up and
                    down arrows to review and enter to select. Touch
                    device users, explore by touch or with swipe
                    gestures.
                </label>
                <div className="deliver-to-body-content-nested-div-level-one-nested">
                    <div className="deliver-to-body-content-nested-div-level-one-nested-svg-div-one">
                        <div className="deliver-to-body-content-nested-div-level-one-nested-svg-div-two">
                            <svg
                                width="24px"
                                height="24px"
                                fill="none"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                                aria-hidden="true"
                                focusable="false"
                            >
                                <path
                                d="M17.5834 5.16602C14.5001 2.08268 9.50008 2.08268 6.41675 5.16602C3.33341 8.24935 3.33341 13.3327 6.41675 16.416L12.0001 21.9993L17.5834 16.3327C20.6667 13.3327 20.6667 8.24935 17.5834 5.16602ZM12.0001 12.416C11.0834 12.416 10.3334 11.666 10.3334 10.7493C10.3334 9.83268 11.0834 9.08268 12.0001 9.08268C12.9167 9.08268 13.6667 9.83268 13.6667 10.7493C13.6667 11.666 12.9167 12.416 12.0001 12.416Z"
                                fill="currentColor"
                                ></path>
                            </svg>
                        </div>
                    </div>
    
                    <div className="spacer _16"></div>
                    <input
                        type="text"
                        autoComplete="off"
                        className="deliver-to-input"
                        placeholder="Enter postcode"
                    ></input>
                    <div className="spacer _8"></div>
                </div>
    
                <button className="deliver-to-done-button">
                    Go
                </button>
            </div>
        </div>
      )
}

export default PostcodeModal
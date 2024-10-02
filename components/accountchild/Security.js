import React from "react";

export default function Security({handlePasswordUpdate}) {
    return(
     
        <div className="account-component">
            <div className="title-with-button">
                <h1>Security</h1>
                <button type="button" className="register-button">Update</button>
            </div>

            <div>
                <h2>Logging</h2>
                <div className="security-detail" onClick={() => handlePasswordUpdate(true)}>
                    <div className="security-password">
                    <h6>Password:</h6>
                    <p className="password-display">
                        <span className="password-dots">*</span>
                        <span className="password-dots">*</span>
                        <span className="password-dots">*</span>
                        <span className="password-dots">*</span>
                        <span className="password-dots">*</span>
                        <span className="password-dots">*</span>
                    </p>

                    <p>Last Password Changed . 20 Sept 2024.</p>
                    </div>

                    <div className="svg">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" color="#A6A6A6">
                            <title>Chevron right small</title>
                            <path d="m16.9 12-4.6 6H8.5l4.6-6-4.6-6h3.8l4.6 6Z" fill="currentColor"></path>
                        </svg>
                    </div>

                </div>
            </div>
      </div>

    )
}

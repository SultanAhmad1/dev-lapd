import SubAtLoadLoadShow from "./subcomponents/SubAtLoadLoadShow"

function AtLoadModalShow() 
{

    return (
        <>
            <div className="modal-delivery-details">
                <div className="modal-delivery-details-level-one-div">
                    <div className="modal-delivery-details-level-one-div-height"></div>

                    <div className="modal-delivery-details-level-one-div-dialog">
                        <div></div>

                        <div className="modal-delivery-details-level-one-div-dialog-header">
                            <div className="delivery-empty-div"></div>
                            <button className="delivery-modal-close-button">
                                <div
                                    className="delivery-modal-close-button-svg-div"
                                    onClick={() =>
                                        setAtfirstload(!atfirstload)
                                    }
                                >
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
                                        d="m19.5831 6.24931-1.8333-1.83329-5.75 5.83328-5.75-5.83328-1.8333 1.83329 5.8333 5.74999-5.8333 5.75 1.8333 1.8333 5.75-5.8333 5.75 5.8333 1.8333-1.8333-5.8333-5.75z"
                                        fill="#000000"
                                    ></path>
                                    </svg>
                                </div>
                            </button>
                        </div>
                        <SubAtLoadLoadShow />
                    </div>

                    <div className="modal-delivery-details-level-one-div-height"></div>
                </div>
            </div>
        </>
    )
}

export default AtLoadModalShow
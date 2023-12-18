import React from 'react'
import SubStoreClosedModal from './subcomponents/SubStoreClosedModal'

function StoreClosedModal() 
{
    return (
        <>
            <div className="modal-store-closed">
                <div className="modal-store-closed-level-one-div">
                    <div className="modal-store-closed-level-one-div-height"></div>

                    <div className="modal-store-closed-level-one-div-dialog">
                        <div></div>
                        <SubStoreClosedModal />
                    </div>

                    <div className="modal-store-closed-level-one-div-height"></div>
                </div>
            </div>
        </>
    )
}

export default StoreClosedModal
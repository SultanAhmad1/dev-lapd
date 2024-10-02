import React, { useContext, useEffect } from 'react'
import HomeContext from '../contexts/HomeContext'
import Image from 'next/image'

function NothingFound() {
    const{
        setHeaderSearchBarDisplay,
        setHeaderPostcodeBtnDisplay,
        setHeaderCartBtnDisplay,
        setHeaderUserBtnDisplay,
    } = useContext(HomeContext)

    useEffect(() => {
        setHeaderSearchBarDisplay(false)
        setHeaderPostcodeBtnDisplay(false)
        setHeaderCartBtnDisplay(false)
        setHeaderUserBtnDisplay(false)
    }, [])
    
  return (
    
    <div className="afczcvfkf6f7f8f9-not-found">
        <div className="docr-not-foun-single-div"></div>
        <div data-test="feed-desktop" data-testid="feed-desktop" className="klkmknkokpkqkr-not-found">
            <div className="czx8-not-found">
                <div className="alamvwbcvxcm-not-found">
                    <div className="bfvyvzw0-not-found">
                        <Image alt="" role="presentation" src="https://d3i4yxtzktqr9n.cloudfront.net/web-eats-v2/f601b8be1064c30a.svg" width={100} height={100} className="bhae-not-found" />
                    </div>

                    <div className="bkblbmbnbjlz-not-found">
                        There is something went wrong.
                    </div>

                    <div className="bobpbqbrbjbdbg-not-found">
                        Please refresh and try again!.
                    </div>
                    
                </div>
            </div>
        </div>
    </div>
  )
}

export default NothingFound
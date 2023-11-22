import React, { useContext } from 'react'
import HomeContext from '../contexts/HomeContext'

function MobileTopBar() 
{
    const {navcategories,navmobileindex,isscrolled,scrollPosition, setNavmobileindex} = useContext(HomeContext)
  return (
    <div className={`top-bar ${isscrolled ? 'scrolled' : ''}`}>
        <div className="top-bar-div-level-one">
            <div className="akaptopbar-div">
                <div className="b0albctopbar-div">
                    {/* <div className="nlalh2bcbdnmnntopbar-div">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <title>Search</title>
                        <path d="M22.6 20.4 18.2 16c1.1-1.6 1.8-3.5 1.8-5.6C20 5.2 15.7.9 10.5.9S1 5.2 1 10.4s4.3 9.5 9.5 9.5c2.1 0 4-.7 5.6-1.8l4.4 4.4 2.1-2.1ZM4 10.5C4 6.9 6.9 4 10.5 4S17 6.9 17 10.5 14.1 17 10.5 17 4 14.1 4 10.5Z" fill="currentColor"></path>
                    </svg>
                    </div> */}
                    <div className="alaqbbbcnocqavlcakawtopbar-div"   >

                    {
                        navcategories?.map((navcat, index) => 
                        {
                        return(
                        <a style={{transform: `translate3d(-${scrollPosition}px, 0px,0px)`}}  key={navcat.id} href={`#section${navcat.id}`} className={`bycsc0ctnmalc8bcc6nptopbar-div ${navmobileindex === navcat.id ? "np" : ""}`} onClick={() => setNavmobileindex(navcat.id)}>
                            <div className="bycsd3d4topbar-div">
                            {navcat.name}
                            </div>
                        </a>
                        )
                        })
                    }

                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default MobileTopBar
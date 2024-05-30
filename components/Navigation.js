import React, { useContext } from 'react'
import HomeContext from '../contexts/HomeContext'

function Navigation({handleCategoryClick}) 
{
    
    const {websiteModificationData,navigationcategories,navmobileindex} = useContext(HomeContext)

    return (
        <div className="left-bar">
            <div className="left-bar-div-one">
                <div className="left-bar-empty-div"></div>
                <div>
                    <div className="left-bar-nested-div-level-one">
                        <div className="left-bar-nested-div-level-one-nestd">
                            <nav className="navigation">
                            {
                                navigationcategories?.map((category, index) =>
                                {
                                    return(
                                        parseInt(category?.items?.length) > parseInt(0) &&
                                        <div className="navigation-div" key={index}>
                                            <button  className={`navigation-btn ${index === navmobileindex ? "active" : ""}`} onClick={() => handleCategoryClick(index)}>
                                                <div className="navigation-btn-div" style={{color: (websiteModificationData?.websiteModificationLive !== null && websiteModificationData?.websiteModificationLive?.json_log[0]?.categoryFontColor !== null) && websiteModificationData?.websiteModificationLive?.json_log[0]?.categoryFontColor}}>{category.title}</div>
                                            </button>
                                        </div>
                                    )
                                })
                            }
                            </nav>
                        </div>
                    </div>
                </div>
            </div>
            <div className="spacer _8"></div>
        </div>
    )
}

export default Navigation
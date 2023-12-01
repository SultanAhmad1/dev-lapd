import React, { useContext } from 'react'
import HomeContext from '../contexts/HomeContext'

function Navigation({handleCategoryClick}) 
{
    const {navigationcategories,navmobileindex} = useContext(HomeContext)

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
                                        <div className="navigation-div" key={index}>
                                            <button className={`navigation-btn ${category.id === navmobileindex ? "active" : ""}`} onClick={() => handleCategoryClick(category?.id)}>
                                                <div className="navigation-btn-div">{category.title}</div>
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
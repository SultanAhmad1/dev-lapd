import React, { useContext } from 'react'
import HomeContext from '../contexts/HomeContext'

function Navigation() 
{
    const {navcategories, navmobileindex, setNavmobileindex} = useContext(HomeContext)

    return (
        <div className="left-bar">
            <div className="left-bar-div-one">
            <div className="left-bar-empty-div"></div>
            <div>
                <div className="left-bar-nested-div-level-one">
                <div className="left-bar-nested-div-level-one-nestd">
                    <nav className="navigation">
                    {
                        navcategories?.map((categories, index) =>
                        {
                        return(
                        <div className="navigation-div" key={index}>
                            <a href={`#section${categories.id}`} className={`navigation-btn ${categories.id === navmobileindex ? "active" : ""}`} onClick={() => setNavmobileindex(categories?.id)}>
                            <div className="navigation-btn-div">{categories.name}</div>
                            </a>
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
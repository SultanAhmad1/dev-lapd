import React, { useContext } from 'react'
import HomeContext from '../contexts/HomeContext'

function MobileTopBar() 
{
    const {navigationcategories} = useContext(HomeContext)
    
    const navbarCategories = document.getElementById("navbar-categories");
    const sections = document.querySelectorAll("section");

    window.addEventListener("scroll", () => {
        
        let currentSection = "";
        const topBar = document.querySelector('.top-bar')
            // Detect the section currently in the viewport
        if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) 
        {
            topBar.style.top = "0vh"
            sections.forEach((section) => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                if (window.scrollY >= sectionTop - sectionHeight / 3) {
                    currentSection = section.getAttribute("id");
                }
            });

            // Remove 'active' class from all navbar categories
            document.querySelectorAll(".navbar ul li").forEach((li) => {
                li.classList.remove("active");
            });

            // Add 'active' class to the navbar category related to the current section
            if (currentSection) {
                document
                    .querySelector(`.navbar ul li[data-target="${currentSection}"]`)
                    .classList.add("active");

                // Scroll the active category into view (left-align)
                const activeItem = document.querySelector(".navbar ul li.active");
                activeItem.scrollIntoView({ behavior: "smooth", inline: "start" });
            }
            return
        }
        
        topBar.style.top = "35vh"
        return
    });

    // Navbar category click event to scroll to the corresponding section
    document.querySelectorAll(".navbar ul li").forEach((li) => {
        li.addEventListener("click", (e) => {
            const targetSection = document.getElementById(e.target.getAttribute("data-target"));
            window.scrollTo({
                top: targetSection.offsetTop,
                behavior: "smooth",
            });
        });
    });

    return (
        // <div className="top-bar-div-level-one">
        //     <div className="akaptopbar-div">
        //         <div className="b0albctopbar-div">
        //             <div className="alaqbbbcnocqavlcakawtopbar-div"   >

        //                 {
        //                     navigationcategories?.map((category, index) => 
        //                     {
        //                         return(
        //                             parseInt(category?.items?.length) > parseInt(0) &&
        //                             <button style={{transition: "transform 0.3s ease",transform: `translate3d(${scrollDirection === 'Down' ? `-${scrollPosition}px` : `${scrollPosition}px`}, 0px, 0px)`}}  key={index} className={`bycsc0ctnmalc8bcc6nptopbar-div ${navmobileindex === index ? "np" : ""}`} onClick={() => handleCategoryClick(index)}>
        //                                 <div className="bycsd3d4topbar-div" style={{color: (websiteModificationData?.websiteModificationLive !== null && websiteModificationData?.websiteModificationLive?.json_log[0]?.categoryFontColor !== null) && websiteModificationData?.websiteModificationLive?.json_log[0]?.categoryFontColor}}>
        //                                     {category.title}
        //                                 </div>
        //                             </button>
        //                         )
        //                     })
        //                 }

        //             </div>
        //         </div>
        //     </div>
        // </div>

        <div className="navbar">
            <ul id="navbar-categories">
                {
                    navigationcategories?.map((category, index) => {
                        const myTarget = `section_${index}`
                        return(
                            parseInt(category?.items?.length) > parseInt(0) &&
                            <li key={index} data-target={`section_${index}`} className={index === 0 ? "active" : ""} >{category?.title}</li>
                        )
                    })
                }
            </ul>
        </div>
    )
}

export default MobileTopBar
"use client";
import React, { useContext, useEffect, useState } from 'react'
import HomeContext from '../contexts/HomeContext'

function MobileTopBar() 
{
    const {navigationCategories, websiteModificationData} = useContext(HomeContext)
    
    useEffect(() => {
        const navbarCategories = document.getElementById("navbar-categories");
        const sections = document.querySelectorAll("section");
    
        window.addEventListener("scroll", () => {
            let currentSection = "";
            const topBar = document.querySelector('.top-bar');
            
            // Check if the scroll is past 100px
            if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
                topBar.style.top = "0vh";
                topBar.style.zIndex = "999";
                topBar.style.position = "fixed";
                
                // Detect the section currently in the viewport
                sections.forEach((section) => {
                    const sectionTop = section.offsetTop;
                    const sectionHeight = section.clientHeight;
                    if (window.scrollY >= sectionTop - sectionHeight / 3) {
                        currentSection = section.getAttribute("id");
                    }
                });
    
                // Remove 'active' class from all navbar categories
                document.querySelectorAll(".navbar li").forEach((li) => {
                    li.classList.remove("active");
                    li.style.background = websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonBackgroundColor;
                    li.style.color = websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonColor;
                });
    
                // Add 'active' class to the navbar category related to the current section
                if (currentSection) {
                    const activeLi = document.querySelector(`.navbar li[data-target="${currentSection}"]`);
                    if (activeLi) {
                        activeLi.classList.add("active");
                        activeLi.style.background = websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonHoverBackgroundColor;
                        activeLi.style.color = websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonHoverColor;
    
                        // Scroll the active category into view (left-align)
                        activeLi.scrollIntoView({ behavior: "smooth", inline: "start" });
                    }
                }
    
            } else {
                // When scrolling to the top, remove the 'active' class from all categories
                document.querySelectorAll(".navbar li").forEach((li) => {
                    li.classList.remove("active");
                    li.style.background = websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonBackgroundColor;
                    li.style.color = websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonColor;
                });
    
                // Set the first button as active when scrolling to the top
                const firstLi = document.querySelector(".navbar li:first-child");
                if (firstLi) {
                    firstLi.classList.add("active");
                    firstLi.style.background = websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonHoverBackgroundColor;
                    firstLi.style.color = websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonHoverColor;
                }
    
                // Reset top bar styles
                topBar.style.top = "";
                topBar.style.zIndex = "";
                topBar.style.position = "";
            }
        });
    
        // Navbar category click event to scroll to the corresponding section
        document.querySelectorAll(".navbar li").forEach((li) => {
            li.addEventListener("click", (e) => {
                const targetSection = document.getElementById(e.target.getAttribute("data-target"));
                window.scrollTo({
                    top: targetSection.offsetTop,
                    behavior: "smooth",
                });
            });
        });
    });
    
    return (
        // <div className="top-bar-div-level-one">
        //     <div className="akaptopbar-div">
        //         <div className="b0albctopbar-div">
        //             <div className="alaqbbbcnocqavlcakawtopbar-div"   >

        //                 {
        //                     navigationCategories?.map((category, index) => 
        //                     {
        //                         return(
        //                             parseInt(category?.items?.length) > parseInt(0) &&
        //                             <button style={{transition: "transform 0.3s ease",transform: `translate3d(${scrollDirection === 'Down' ? `-${scrollPosition}px` : `${scrollPosition}px`}, 0px, 0px)`}}  key={index} className={`bycsc0ctnmalc8bcc6nptopbar-div ${navMobileIndex === index ? "np" : ""}`} onClick={() => handleCategoryClick(index)}>
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
            // {/* <ul id="navbar-categories" style={{background: websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonBackgroundColor}}> */}
        <div className='top-bar navbar-div' style={{background: websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonBackgroundColor}}>
            <ul className="navbar" id="navbar-categories" style={{background: websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonBackgroundColor}}>
                {
                    navigationCategories?.map((category, index) => {
                        
                        return(
                            parseInt(category?.items?.length) > parseInt(0) &&
                            // <li key={index} data-target={`section_${index}`} className={index === 0 ? "active" : ""} >{category?.title}</li>

                            <li 
                                key={index} 
                                data-target={`section_${index}`} 
                                className={index === 0 ? "active" : ""}
                                style={{
                                    background: index === 0 ? websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonHoverBackgroundColor : websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonBackgroundColor,
                                    color: index === 0 ? websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonHoverColor : websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonColor,
                                    // border: index !== 0 && `1px solid ${websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonHoverBackgroundColor}`,
                                }}      
                            
                            >{category?.title}</li>
                        )
                    })
                }
            </ul>
        </div>
    )
}

export default MobileTopBar
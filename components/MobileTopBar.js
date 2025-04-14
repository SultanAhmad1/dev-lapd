"use client";
import React, { useContext, useEffect } from 'react'
import HomeContext from '../contexts/HomeContext'

function MobileTopBar() 
{
    const {navigationCategories, websiteModificationData} = useContext(HomeContext)
    
    const handleClickScroll = (index, e) => {
        e.preventDefault()

        const targetSection = document.getElementById(`section_${index}`);
        window.scrollTo({
            top: targetSection.offsetTop,
            behavior: "smooth",
        });
    }

    useEffect(() => {
        const navbarCategories = document.getElementById("navbar-categories");
        const sections = document.querySelectorAll("section");
    
        window.addEventListener("scroll", () => {
            let currentSection = "";
            let topBar = document.querySelector('.top-bar');
            
            // Check if the scroll is past 100px
            if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
                if(topBar !== null)
                {
                    topBar.style.top = "0vh";
                    topBar.style.zIndex = "999";
                    topBar.style.position = "fixed";
                }
                
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
                    
                    // const activeLi = document.querySelector(`.navbar li[data-target="${currentSection}"]`);
                    // if (activeLi) {
                        // activeLi.classList.add("active");
                        // activeLi.style.background = websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonHoverBackgroundColor;
                        // activeLi.style.color = websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonHoverColor;
    
                        // // Scroll the active category into view (left-align)
                        // // activeLi.scrollIntoView({ behavior: "smooth", inline: "start" });
                        // activeLi.scrollTo({ behavior: "smooth", inline: "start" });
                    // }

                    const navbar = document.querySelector(".navbar"); // Get the scrollable container
                    const activeLi = document.querySelector(`.navbar li[data-target="${currentSection}"]`);

                    if (activeLi && navbar) {
                        activeLi.classList.add("active");
                        activeLi.style.background = websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonHoverBackgroundColor;
                        activeLi.style.color = websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonHoverColor;

                        // Scroll the navbar container instead of the individual item
                        navbar.scrollTo({
                            left: activeLi.offsetLeft - navbar.offsetWidth / 3 + activeLi.offsetWidth / 3,
                            // left: activeLi.offsetLeft,
                            behavior: "smooth"
                        });
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
                if(topBar !== null)
                {
                    topBar.style.top = "unset";
                    topBar.style.zIndex = "0";
                    topBar.style.position = "unset";
                }
            }
        });
    
        // Navbar category click event to scroll to the corresponding section
      
    });
    
    return (
       
        <div 
            className='top-bar navbar-div' 
            style={{background: websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonBackgroundColor || "#444"}}
        >
            <ul 
                className="navbar" 
                id="navbar-categories" 
                style={{background: websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonBackgroundColor || "#444"}}
            >
                {
                    navigationCategories?.map((category, index) => {
                        
                        return(
                            parseInt(category?.items?.length) > parseInt(0) &&

                            <li 
                                    key={index} 
                                    data-target={`section_${index}`} 
                                    className={index === 0 ? "active" : ""}
                                    style={{
                                        background: index === 0 ? 
                                            websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonHoverBackgroundColor 
                                        : 
                                            websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonBackgroundColor,
                                        color: index === 0 ? 
                                            websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonHoverColor 
                                        : 
                                            websiteModificationData?.websiteModificationLive?.json_log?.[0]?.buttonColor,
                                    }} 
                                    onClick={(e) => handleClickScroll(index, e)}    
                                >
                                {category?.title}
                            </li>
                        )
                    })
                }
            </ul>
        </div>
    )
}

export default MobileTopBar
"use client";
import React, { Fragment, useContext, useEffect } from 'react'
import HomeContext from '../contexts/HomeContext'

function Navigation() 
{
    const {websiteModificationData,navigationcategories} = useContext(HomeContext)

    useEffect(() => {
        const navbarCategories = window.document.getElementById("navbar-categories");
        const sections = window.document.querySelectorAll("section");
    
        window.addEventListener("scroll", () => {
            
            let currentSection = "";
                // Detect the section currently in the viewport
            if (window.document.body.scrollTop > 100 || window.document.documentElement.scrollTop > 100) 
            {
                sections.forEach((section) => {
                    const sectionTop = section.offsetTop;
                    const sectionHeight = section.clientHeight;
                    if (window.scrollY >= sectionTop - sectionHeight / 3) {
                        currentSection = section.getAttribute("id");
                    }
                });
    
                // Remove 'active' class from all navbar categories
                window.document.querySelectorAll(".navigation section div").forEach((li) => {
                    li.classList.remove("_nav_active");
                });
    
                // Add 'active' class to the navbar category related to the current section
                if (currentSection) {
                    window.document.querySelector(`.navigation section div[data-target="${currentSection}"]`).classList.add("_nav_active");
                }
            }
        });
    
        // Navbar category click event to scroll to the corresponding section
        window.document.querySelectorAll(".navigation section div").forEach((li) => {
            li.addEventListener("click", (e) => {
                const targetSection = window.document.getElementById(e.target.getAttribute("data-target"));
                window.scrollTo({
                    top: targetSection.offsetTop,
                    behavior: "smooth",
                });
            });
        });
    });
    

    
    return (
        <Fragment>
            <div className="left-bar-div-one">
                <div className="left-bar-empty-div"></div>
                <div>
                    <div className="left-bar-nested-div-level-one">
                        <div className="left-bar-nested-div-level-one-nestd">
                            <nav className="navigation" id='navbar-categories'>
                            {
                                navigationcategories?.map((category, index) =>
                                {
                                    return(
                                        parseInt(category?.items?.length) > parseInt(0) &&
                                        <section className="navigation-div" key={index} style={{cursor: "pointer"}}>
                                            <div data-target={`section_${index}`}  className={`navigation-btn ${index === 0 ? "_nav_active" : ""}`} style={{color: (websiteModificationData?.websiteModificationLive !== null && websiteModificationData?.websiteModificationLive?.json_log[0]?.categoryFontColor !== null) && websiteModificationData?.websiteModificationLive?.json_log[0]?.categoryFontColor}}>
                                                {category.title}
                                            </div>
                                        </section>
                                    )
                                })
                            }
                            </nav>
                        </div>
                    </div>
                </div>
            </div>
            <div className="spacer _8"></div>
        </Fragment>
    )
}

export default Navigation
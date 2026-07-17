"use client";
import React, { useContext, useEffect } from "react";
import HomeContext from "../contexts/HomeContext";
import { useWebsite } from "@/app/providers/context/WebsiteContext";

function MobileTopBar() {

  const {layoutWebsiteModification} = useWebsite()

  const { navigationCategories, selectedStoreDetails} = useContext(HomeContext);

  const handleClickScroll = (index, e) => {
    e.preventDefault();
    const targetSection = document.getElementById(`section_${index}`);
    if (targetSection) {
      window.scrollTo({
        top: targetSection.offsetTop,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    let lastActiveSection = "";

    const handleScroll = () => {
      const sections = document.querySelectorAll("section");
      let currentSection = "";

      sections.forEach((section) => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.scrollY >= sectionTop - sectionHeight / 3) {
          currentSection = section.getAttribute("id");
        }
      });

      if (!currentSection || currentSection === lastActiveSection) return;

      lastActiveSection = currentSection;

      const navbar = document.getElementById("navbar-categories");
      const lis = navbar?.querySelectorAll("li");

      lis?.forEach((li) => {
        li.classList.remove("active");
        li.style.background = layoutWebsiteModification?.websiteModificationLive?.json_log?.[0]?.navigationBackgroundColor || "#444";
        li.style.color = layoutWebsiteModification?.websiteModificationLive?.json_log?.[0]?.navigationFontColor || "#fff";
      });

      const activeLi = navbar?.querySelector(`li[data-target="${currentSection}"]`);
      if (activeLi) {
        activeLi.classList.add("active");
        activeLi.style.background = layoutWebsiteModification?.websiteModificationLive?.json_log?.[0]?.navigationActiveBackgroundColor || "#fff";
        activeLi.style.color = layoutWebsiteModification?.websiteModificationLive?.json_log?.[0]?.navigationActiveFontColor || "#000";

        // Scroll navbar smoothly to the active item
        navbar?.scrollTo({
          left: activeLi.offsetLeft - navbar.offsetWidth / 3 + activeLi.offsetWidth / 3,
          behavior: "smooth",
        });
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [layoutWebsiteModification]);

  return (
    <div
      className={`w-full sticky ${
        selectedStoreDetails === null
          ? "top-[80px] lg:top-10"
          : "top-0"
      } z-30 bg-[#444]`}
      // className={`w-full sticky top-0 z-${parseInt(booleanObj?.isUnableToSendSms) > parseInt(0) ? "0" : "30"} bg-[#444]`}
      style={{
        background:
          layoutWebsiteModification?.websiteModificationLive?.json_log?.[0]?.navigationBackgroundColor || "#444",
      }}
    >
      <ul
        id="navbar-categories"
        className="mx-auto max-w-[94vw] lg:max-w-[83vw] flex overflow-x-auto whitespace-nowrap scrollbar-none px-2 py-0 gap-2"
        style={{
          background:
            layoutWebsiteModification?.websiteModificationLive?.json_log?.[0]?.navigationBackgroundColor || "#444",
        }}
      >
      {navigationCategories?.map((category, index) => {
          if (parseInt(category?.items?.length) <= 0) return null;

          const isActive = index === 0;
          
          const styles = {
            backgroundColor: isActive
              ? layoutWebsiteModification?.websiteModificationLive?.json_log?.[0]?.navigationActiveBackgroundColor
              : layoutWebsiteModification?.websiteModificationLive?.json_log?.[0]?.navigationBackgroundColor,
            color: isActive
              ? layoutWebsiteModification?.websiteModificationLive?.json_log?.[0]?.navigationActiveFontColor
              : layoutWebsiteModification?.websiteModificationLive?.json_log?.[0]?.navigationFontColor,
          };

          return (
            <li
              key={index}
              data-target={`section_${index}`}
              onClick={(e) => handleClickScroll(index, e)}
              className={`flex-shrink-0 text-sm px-2 font-bold py-3 lg:py-6 cursor-pointer select-none transition-all duration-200 ${
                isActive ? "font-semibold" : ""
              }`}
              style={styles}
            >
            {category?.title.toUpperCase()}
            </li>
          );
        })}

      </ul>
    </div>
  );
}

export default MobileTopBar;

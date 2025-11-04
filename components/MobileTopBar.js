"use client";
import React, { useContext, useEffect } from "react";
import HomeContext from "../contexts/HomeContext";

function MobileTopBar() {
  const { navigationCategories, websiteModificationData } = useContext(HomeContext);

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
        li.style.background = websiteModificationData?.websiteModificationLive?.json_log?.[0]?.navigationBackgroundColor || "#444";
        li.style.color = websiteModificationData?.websiteModificationLive?.json_log?.[0]?.navigationFontColor || "#fff";
      });

      const activeLi = navbar?.querySelector(`li[data-target="${currentSection}"]`);
      if (activeLi) {
        activeLi.classList.add("active");
        activeLi.style.background = websiteModificationData?.websiteModificationLive?.json_log?.[0]?.navigationActiveBackgroundColor || "#fff";
        activeLi.style.color = websiteModificationData?.websiteModificationLive?.json_log?.[0]?.navigationActiveFontColor || "#000";

        // Scroll navbar smoothly to the active item
        navbar?.scrollTo({
          left: activeLi.offsetLeft - navbar.offsetWidth / 3 + activeLi.offsetWidth / 3,
          behavior: "smooth",
        });
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [websiteModificationData]);

  return (
    <div
      className="top-bar navbar-div w-full sticky top-0 z-30 bg-[#444]"
      style={{
        background:
          websiteModificationData?.websiteModificationLive?.json_log?.[0]?.navigationBackgroundColor || "#444",
      }}
    >
      <ul
        id="navbar-categories"
        className="navbar flex overflow-x-auto whitespace-nowrap no-scrollbar px-2 py-0 gap-2"
        style={{
          background:
            websiteModificationData?.websiteModificationLive?.json_log?.[0]?.navigationBackgroundColor || "#444",
        }}
      >
      {navigationCategories?.map((category, index) => {
          if (parseInt(category?.items?.length) <= 0) return null;

          const isActive = index === 0;
          const styles = {
            backgroundColor: isActive
              ? websiteModificationData?.websiteModificationLive?.json_log?.[0]?.navigationActiveBackgroundColor
              : websiteModificationData?.websiteModificationLive?.json_log?.[0]?.navigationBackgroundColor,
            color: isActive
              ? websiteModificationData?.websiteModificationLive?.json_log?.[0]?.navigationActiveFontColor
              : websiteModificationData?.websiteModificationLive?.json_log?.[0]?.navigationFontColor,
          };

          return (
            <li
              key={index}
              data-target={`section_${index}`}
              onClick={(e) => handleClickScroll(index, e)}
              className={`flex-shrink-0 text-sm px-2 font-bold py-6 rounded-md cursor-pointer select-none transition-all duration-200 ${
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

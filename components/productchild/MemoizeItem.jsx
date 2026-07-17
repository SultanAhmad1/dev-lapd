import Image from 'next/image';
import Link from 'next/link';
import { memo } from 'react'
import moment from "moment-timezone";
import { IMAGE_URL_Without_Storage } from '@/global/Axios';

export const MemoizeItem = memo(({category, item, itemIndex, layoutWebsiteModification}) => {
    const {
        title, 
        price, 
        description, 
        image_url, 
        is_promotion, 
        promotion_text, 
        promotion_bg_color, 
        promotion_text_color, 
        days, 
        start_time,end_time,
        display_at_banner,
    } = item;
        
    if(display_at_banner === true) { return }
    // Skip suspended items
    const isItemSuspend =
        item?.suspension_info !== null &&
        moment().format("YYYY-MM-DD") <=
        moment
            .unix(item?.suspension_info?.suspend_untill)
            .format("YYYY-MM-DD");

    if (isItemSuspend) return null;

    // check the category promotion available, or item
    let isPromotionActive = false
    let promotionText = category.promotion_text
    let promotionBgColor = category.promotion_bg_color
    let promotionTextColor = category.promotion_text_color

    const dayNameAndTime = moment.tz("HH:mm", "Europe/London").format("HH:mm:ss");

    if(parseInt(category?.is_promotion) === parseInt(1))
    {
        const currentDay = moment().format("dddd")
        const findDay = category.days?.find((day) => day.label.toLowerCase() === currentDay?.toLocaleLowerCase())
        if(findDay)
        {
        if(dayNameAndTime >= moment(category.start_time, "HH:mm:ss").format("HH:mm:ss") && moment(category.end_time, "HH:mm:ss").format("HH:mm:ss") <= dayNameAndTime)
        {
            isPromotionActive = true
        }
        }
    }
    else if(parseInt(is_promotion) === parseInt(1))
    {
        const currentDay = moment().format("dddd")
        const findDay = days?.find((day) => day.label.toLowerCase() === currentDay?.toLocaleLowerCase())
        if(findDay)
        {
        if(dayNameAndTime >= moment(start_time, "HH:mm:ss").format("HH:mm:ss") && moment(end_time, "HH:mm:ss").format("HH:mm:ss") <= dayNameAndTime)
        {
            isPromotionActive = true
            promotionText = promotion_text
            promotionBgColor = promotion_bg_color
            promotionTextColor = promotion_text_color
        }
        }
    }
    else if(item.is_coming_soon === 1 && moment(item.coming_soon_start_date).format('YYYY-MM-DD') >= moment().format('YYYY-MM-DD'))
    {
        isPromotionActive = true
        promotionText = "Coming soon"
        promotionBgColor = "#ffc107"
        promotionTextColor = "212529"
    }

    const isValidHttpsUrl = (url) => {
        return url.startsWith('https://');
    };

    return (
        <Link
            href={`/${category?.slug}/${item?.slug}`}

            key={itemIndex}
            
            style={{
                "--item-hover-background":
                layoutWebsiteModification?.websiteModificationLive
                    ?.json_log?.[0]?.itemHoverBackgroundColor,
                "--item-hover-font-color":
                layoutWebsiteModification?.websiteModificationLive
                    ?.json_log?.[0]?.itemHoverFontColor,
                "--font-color":
                layoutWebsiteModification?.websiteModificationLive
                    ?.json_log?.[0]?.itemFontColor,
            }}
            className="transition-all duration-500 border border-default shadow-xs flex justify-between relative bg-white rounded-lg transition-colors text-[var(--font-color)] hover:bg-[var(--item-hover-background)] hover:text-[var(--item-hover-font-color)]"
        >
            {/* 🔥 Hot Deal Badge */}
            {
                isPromotionActive &&
                <span
                    className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-bl-lg shadow-md"
                    style={{ backgroundColor: promotionBgColor, color: promotionTextColor }}
                >
                    {promotionText}
                </span>
            }


            {/* Text */}
            <div className="py-1 px-2 flex flex-col gap-1 flex-1 min-w-0">
                <p className="mt-2 text-sm font-bold line-clamp-2 break-words whitespace-normal">
                    {/* {title.split(" ").length >= 4 ? title.split(" ").slice(0, 3).join(" ") + "…" : title} */}
                    {title}
                </p>

                <hr className="my-1 border-gray-300" />

                <p className="h-10 text-sm leading-snug line-clamp-2 break-words whitespace-normal whitespace-pre-line">
                    {description}
                </p>

                <div className="flex justify-between mt-2">
                    {/* ⭐ Rating */}
                    <div className="flex items-center gap-0 mt-1">
                        {/* {[1, 2, 3, 4, 5].map((star) => (
                        <svg
                            key={star}
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill={star <= 4 ? "#facc15" : "#e5e7eb"} // yellow-400 / gray-200
                            className="h-4 w-4"
                        >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.966a1 1 0 00.95.69h4.174c.969 0 1.371 1.24.588 1.81l-3.377 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.921-.755 1.688-1.54 1.118l-3.377-2.455a1 1 0 00-1.176 0l-3.377 2.455c-.784.57-1.838-.197-1.539-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.049 9.393c-.783-.57-.38-1.81.588-1.81h4.174a1 1 0 00.95-.69l1.286-3.966z" />
                        </svg>
                        ))}

                        <span className="text-xs text-gray-500 ml-1">
                        {4?.toFixed(1)}
                        </span> */}
                    </div>
                    <span className="text-base font-medium text-right block ">
                        &pound;{parseFloat(price).toFixed(2)}
                    </span>
                </div>
            </div>

            {/* Image */}
            <div className="w-25">
                {image_url ? 
                    <Image
                        src={
                            isValidHttpsUrl(image_url)
                            ? image_url
                            : `${IMAGE_URL_Without_Storage}${image_url}`
                        }
                        className="object-cover w-30 h-full rounded-r-xl"
                        alt={title}
                        width={120}
                        height={120}
                    />
                :
                    <Image
                        src="/not-found.png"
                        className="object-cover w-30 h-full rounded-r-xl"
                        alt={title}
                        width={120}
                        height={120}
                    />
                }
            </div>
        </Link>
    );
})

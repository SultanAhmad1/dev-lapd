
import { memo } from "react";
import { MemoizeItem } from "./MemoizeItem";

export const MemoizeCategory = memo(({category, index, layoutWebsiteModification}) => {
    return (
        <>
            <section key={category.id} id={`section_${index}`}>
                <h2
                className="text-xl sm:text-2xl font-semibold"
                style={{
                    color:
                    layoutWebsiteModification?.websiteModificationLive?.json_log?.[0]
                        ?.categoryFontColor,
                }}
                >
                {category.title}
                </h2>
            </section>

            <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-3">
                {category.items.map((item, itemIndex) => (
                   <MemoizeItem item={item} itemIndex={itemIndex} category={category} layoutWebsiteModification={layoutWebsiteModification}/>
                ))}
            </div>
        </>
    )
})

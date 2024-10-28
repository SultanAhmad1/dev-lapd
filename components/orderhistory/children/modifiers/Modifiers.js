"use client";

export default function Modifiers({modifier}) 
{
    return(
        <>
            <div className="modifier-items">{modifier?.name}</div> 
            <span className="dot-separator">&nbsp;•&nbsp;</span>
        </>
    )
}

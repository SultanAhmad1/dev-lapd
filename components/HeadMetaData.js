"use client";

function HeadMetaData(props) {

  const {
    dataTitle,
    dataContent,
    singleItemsDetails
  } = props

  console.log("single item:", singleItemsDetails);
  
  return (
    <>
      <title>{dataTitle}</title>
      <meta content='width=device-width, initial-scale=1' name='viewport'></meta>
      <meta name='description' content={dataContent}></meta>
      {/* <meta name="keywords" content={dataContent}></meta> */}
      <meta property="og:title" content={singleItemsDetails?.title} />
      <meta property="og:description" content={singleItemsDetails?.description} />
      <meta property="og:image" content={singleItemsDetails?.itemImage} />
      <meta property="og:url" content={singleItemsDetails?.url} />
    </>
  )
}

export default HeadMetaData
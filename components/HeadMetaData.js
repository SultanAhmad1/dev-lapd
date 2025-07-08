"use client";
function HeadMetaData(props) {

  const {
    title,
    content,
    iconImage,
    singleItemsDetails
  } = props

  return (
    <>
      <title>LAPD Food Oldham - Fast Food Delivery & Takeaway Near Me</title>
      <meta content='width=device-width, initial-scale=1' name='viewport'></meta>
      <meta name='description' content="Lapd Food is a best online takeaway in Oldham. Get your favourites delivered pizzas, burgers, peri peri chicken, wraps & more. Fast service, local flavours."></meta>
      <meta name="keywords" content={content}></meta>
      <link rel='icon' href={iconImage} type="image/x-icon" sizes="18x17"></link>
      <meta property="og:title" content={singleItemsDetails?.title} />
      <meta property="og:description" content={singleItemsDetails?.description} />
      <meta property="og:image" content={singleItemsDetails?.itemImage} />
      <meta property="og:url" content={singleItemsDetails?.url} />

     
    </>
  )
}

export default HeadMetaData
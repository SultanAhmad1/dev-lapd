"use client"
import { Inter } from 'next/font/google'
import './globals.css'
import HeadMetaData from './components/HeadMetaData'
import Header from './components/Header'
import Banner from './components/Banner'
import Footer from './components/Footer'
import HomeContext from './contexts/HomeContext'
import { useEffect, useState } from 'react'
import Cart from './components/Cart'
import AtLoadModalShow from './components/modals/AtLoadModalShow'
import DeliveryModal from './components/modals/DeliveryModal'
import AvailableStoresShow from './components/modals/AvailableStoresShow'
import moment from 'moment/moment'
import { BRAND_GUID, PARTNER_ID, axiosPrivate } from './global/Axios'
import StoreClosedModal from './components/modals/StoreClosedModal'
import { setLocalStorage, setSessionStorage } from './global/Store'
import Loader from './components/modals/Loader'

const inter = Inter({ subsets: ['latin'] })

// export const metadata = {
//   title: 'Create Next App',
//   description: 'Generated by create next app',
// }

export default function RootLayout({ children }) 
{
  const [loader, setLoader] = useState(true)
  // Header Bar buttons to be displayed.
  const [brandlogo, setBrandlogo] = useState("../gallery/uber-eat.svg")
  const [headerUserBtnDisplay, setHeaderUserBtnDisplay] = useState(true)
  const [headerPostcodeBtnDisplay, setHeaderPostcodeBtnDisplay] = useState(true)
  const [headerSearchBarDisplay, setHeaderSearchBarDisplay] = useState(false)
  const [headerCartBtnDisplay, setHeaderCartBtnDisplay] = useState(true)
  
  // FilterLocationTime Component States
  const [storeGUID, setStoreGUID] = useState(0)
  const [storeName, setStoreName] = useState("")
  const [storetodaydayname, setStoretodaydayname] = useState("")
  const [storetodayopeningtime, setStoretodayopeningtime] = useState("")
  const [storetodayclosingtime, setStoretodayclosingtime] = useState("")

  const [iscartbtnclicked, setIscartbtnclicked] = useState(false)

  const [selectedcategoryid, setSelectedcategoryid] = useState(0)
  const [selecteditemid, setSelecteditemid] = useState(0)

  const [firstname, setFirstname] = useState("Sultan")
  const [lastname, setLastname] = useState("Ahmad")

  // Day Name and Day Number
  const [dayname, setDayname] = useState("")
  const [daynumber, setDaynumber] = useState(0)
  // HomeContext Data
  const [postcodefororderamount, setPostcodefororderamount] = useState("")
  const [postcode, setPostcode] = useState("")
  const [street1, setStreet1] = useState("")
  const [street2, setStreet2] = useState("")
  const [deliverymatrix, setDeliverymatrix] = useState(null)
  const [totalOrderAmountValue, settotalOrderAmountValue] = useState(0)

  // Boolean States
  const [iscouponcodeapplied, setIscouponcodeapplied] = useState(false)

  const [isTimeToClosed, setIsTimeToClosed] = useState(false)
  const [atfirstload, setAtfirstload] = useState(false)

  const [isdeliverybtnclicked, setIsdeliverybtnclicked] = useState(false);
  const [isdeliverychangedbtnclicked, setIsdeliverychangedbtnclicked] = useState(false);
  const [iscartfull, setIscartfull] = useState(true)

  const [iscartitemdottedbtnclicked, setIscartitemdottedbtnclicked] = useState(false)
  const [isitemclicked, setIsitemclicked] = useState(false)
  const [isquickviewclicked, setIsquickviewclicked] = useState(false)
  const [ischeckoutclicked, setIscheckoutclicked] = useState(false)

  // Button states
  const [isgobtnclicked, setIsgobtnclicked] = useState(false)

  const [Menu, setMenu] = useState([])
  const [selectedFilter, setSelectedFilter] = useState(null)
  const [filters, setFilters] = useState([])

  const [navigationcategories, setNavigationcategories] = useState([])
  const [navmobileindex, setNavmobileindex] = useState(0)
  const [ismenuavailable, setIsmenuavailable] = useState(true)

  const [cartdata, setCartdata] = useState([])
  const [amountDiscountapplied, setAmountDiscountapplied] = useState(null)
  const [couponDiscountapplied, setCouponDiscountapplied] = useState([])

  const fetchMenu = async (storeID) => 
  {
    try 
    {
      const data = {
        location:storeID,
        brand: BRAND_GUID,
        partner: PARTNER_ID
      }

      const response = await axiosPrivate.post(`/menu`, data);
      const convertToJSobj = JSON.parse(response.data?.data?.menu.menu_json_log)
      setMenu(convertToJSobj)
      
      // const getFilterDataFromObj = JSON.parse(window.localStorage.getItem('filter'))
      const getFilterDataFromObj = JSON.parse(window.sessionStorage.getItem('filter'))
      if(getFilterDataFromObj === null)
      {
        // setLocalStorage('filter',convertToJSobj.filters[0])
        setSessionStorage('filter',convertToJSobj.filters[0])
      }
      setSelectedFilter(getFilterDataFromObj === null ? convertToJSobj.filters[0] : getFilterDataFromObj)
      setFilters(convertToJSobj.filters)
      setNavigationcategories(convertToJSobj.categories)
      setNavmobileindex(convertToJSobj.categories[0].id)

      const getDayInformation = convertToJSobj.menus[0].service_availability?.find((dayinformation) => dayinformation.day_of_week === moment().format('dddd').toLowerCase())
      setStoretodaydayname(moment().format('dddd'))
      setStoretodayopeningtime(getDayInformation.time_periods[0].start_time)
      setStoretodayclosingtime(getDayInformation.time_periods[0].end_time)
    } 
    catch (error) 
    {
      console.error('Error fetching data:', error);
      setIsmenuavailable(false)
    }
  };

  const handleItemClicked = () =>
  {
    setIsitemclicked(true)
    setIsquickviewclicked(false)
  }

  const handleQuickViewClicked = () =>
  {
    setIsquickviewclicked(true)
    setIsitemclicked(false)
  }

  

  const handleItemModalOff = (event) =>
  {
    event.preventDefault();
    setIsitemclicked(false)
  }

  const handleCheckout = () =>
  {
    setIscheckoutclicked(true)
    setIscartbtnclicked(false)
  }
  // HomeContext Data End
  // const {iscartbtnclicked, setIscartbtnclicked} = useContext(HomeContext)


  // const contentRef = useRef(null);
  
  // const [contentWidth, setContentWidth] = useState(0);
  
  useEffect(() => 
  {
    const url = new URL(window.location.href)
    var pathnameArray = url.pathname.split("/").filter(function(segment) {
      return segment !== ""; // Filter out empty segments
    });
    
   
    const dayNumber = moment().day();

    // Get the current day name
    const dayName = moment().format('dddd');

    setDayname(dayName)
    setDaynumber(dayNumber)
    
    const afterReloadingGetCouponCode = JSON.parse(window.sessionStorage.getItem("applied_coupon"))
    setCouponDiscountapplied(afterReloadingGetCouponCode !== null ? afterReloadingGetCouponCode : [])
    // const getSelectStore = window.localStorage.getItem('user_selected_store')
    const getSelectStore = window.sessionStorage.getItem('user_selected_store')
    if(getSelectStore === null)
    {
      if(pathnameArray[0] === 'track-order' || pathnameArray[0] === 'review-order' || pathnameArray[0] === 'payment' || pathnameArray[0] === 'place-order')
      {
        setAtfirstload(false)  
        setHeaderCartBtnDisplay(false)
        setHeaderPostcodeBtnDisplay(false)
      }
      else
      {
        setAtfirstload(true)
        setHeaderCartBtnDisplay(true)
        setHeaderPostcodeBtnDisplay(true)
      }
    }
    else
    {
      // setPostcode(JSON.parse(window.localStorage.getItem('user_valid_postcode')))
      setPostcode(JSON.parse(window.sessionStorage.getItem('user_valid_postcode')))

      const parseToJSobj = JSON.parse(getSelectStore)
      fetchMenu((parseToJSobj === null) ? storeGUID : parseToJSobj.display_id)
      setStoreGUID((parseToJSobj === null) ? storeGUID : parseToJSobj.display_id)
      setStoreName(parseToJSobj.store)

      // const address = JSON.parse(window.localStorage.getItem('address'))
      // const getDeliveryMatrix = JSON.parse(window.localStorage.getItem('delivery_matrix'))

      const appliedAmountDiscount = JSON.parse(window.sessionStorage.getItem("order_amount_discount_applied"))
      const address = JSON.parse(window.sessionStorage.getItem('address'))
      const getDeliveryMatrix = JSON.parse(window.sessionStorage.getItem('delivery_matrix'))
      setAmountDiscountapplied(appliedAmountDiscount)
      setDeliverymatrix(getDeliveryMatrix)
      setPostcodefororderamount(getDeliveryMatrix?.postcode)

      const parseToJSobjAvailableStore = address?.availableStore
      if(parseInt(parseToJSobjAvailableStore.length) > parseInt(0))
      {
        for(const store of parseToJSobjAvailableStore)
        {
          if(parseToJSobj.display_id === store?.location_guid)
          {
            setStreet1(store?.user_street1)
            setStreet2(store?.user_street2)
          }
        }
      }

      // setCart Data from local storage
      // const cartDataFromLocalStorage = JSON.parse(window.localStorage.getItem('cart'))
      const cartDataFromLocalStorage = JSON.parse(window.sessionStorage.getItem('cart'))

      setCartdata((cartDataFromLocalStorage === null) ? [] : cartDataFromLocalStorage)
    }
    // Set a timeout to clear localStorage after 20 minutes (20 * 60 * 1000 milliseconds)
    const timeoutId = setTimeout(() => {
      // Clear all items in localStorage
      sessionStorage.clear();
      window.location.reload(true)
      
    }, 30 * 60 * 1000);
    setLoader(false)
    // Clear the timeout if the component is unmounted before 20 minutes
    return () => clearTimeout(timeoutId);
  }, []);
  
  return (
    <html lang="en">
      <HeadMetaData />
      <body className="body-tag">
        <HomeContext.Provider 
          value={{
            setIscouponcodeapplied,
            setLoader,
            totalOrderAmountValue,
            settotalOrderAmountValue,
            setIsTimeToClosed,
            selectedFilter,
            setSelectedFilter,
            filters,
            setFilters,
            selectedcategoryid,
            setSelectedcategoryid,
            selecteditemid,
            setSelecteditemid,
            brandlogo,
            setBrandlogo,
            storeGUID,
            storeName,
            storetodaydayname,
            storetodayopeningtime,
            storetodayclosingtime,
            setMenu,
            setStoreGUID,
            setStoreName,
            setStoretodaydayname,
            setStoretodayopeningtime,
            setStoretodayclosingtime,
            Menu,
            navigationcategories, 
            navmobileindex, 
            ismenuavailable, 
            setNavigationcategories, 
            setNavmobileindex, 
            setIsmenuavailable, 
            headerSearchBarDisplay,
            setHeaderSearchBarDisplay,
            headerPostcodeBtnDisplay, 
            headerCartBtnDisplay, 
            headerUserBtnDisplay,
            setHeaderPostcodeBtnDisplay, 
            setHeaderCartBtnDisplay, 
            setHeaderUserBtnDisplay,
            dayname,
            daynumber,
            setIsgobtnclicked, 
            firstname,
            lastname,
            setAtfirstload,
            postcode, 
            setPostcode, 
            street1, 
            setStreet1, 
            street2, 
            setStreet2,
            isdeliverychangedbtnclicked, 
            setIsdeliverychangedbtnclicked,
            ischeckoutclicked, 
            setIscheckoutclicked,
            iscartitemdottedbtnclicked,
            setIscartitemdottedbtnclicked,
            iscartfull,
            iscartbtnclicked,
            setIscartbtnclicked, 
            setIsitemclicked, 
            setIsdeliverybtnclicked, 
            setCartdata,
            amountDiscountapplied,
            setAmountDiscountapplied,
            couponDiscountapplied,
            setCouponDiscountapplied,
            cartdata,
            deliverymatrix,
            setDeliverymatrix,
            postcodefororderamount,
            setPostcodefororderamount
          }}>
          <Header />
          {children}
          {atfirstload && <AtLoadModalShow />}
          {iscartbtnclicked && <Cart />}
          {isdeliverybtnclicked && <DeliveryModal />}
          {/* {isgobtnclicked && <AvailableStoresShow />} */}
          {isTimeToClosed && <StoreClosedModal />}
          {/* {iscouponcodeapplied && <StoreClosedModal />} */}
          <Footer />
          <Loader loader={loader}/>
        </HomeContext.Provider>
      </body>
    </html>
  )
}

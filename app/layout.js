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

const inter = Inter({ subsets: ['latin'] })

// export const metadata = {
//   title: 'Create Next App',
//   description: 'Generated by create next app',
// }

export default function RootLayout({ children }) 
{
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

  const fetchMenu = async () => {
    try {
      const data = {
        brand: BRAND_GUID,
        partner: PARTNER_ID
      }

      const response = await axiosPrivate.post(`/menu`, data);
      console.log("Success repsonse:", JSON.parse(response.data?.data?.menu.menu_json_log));
      const convertToJSobj = JSON.parse(response.data?.data?.menu.menu_json_log)
      setMenu(convertToJSobj)
      
      const getFilterDataFromObj = JSON.parse(window.localStorage.getItem('filter'))
      setSelectedFilter(getFilterDataFromObj === null ? convertToJSobj.filters[0] : getFilterDataFromObj)
      setFilters(convertToJSobj.filters)
      setNavigationcategories(convertToJSobj.categories)
      setNavmobileindex(convertToJSobj.categories[0].id)

      const getDayInformation = convertToJSobj.menus[0].service_availability?.find((dayinformation) => dayinformation.day_of_week === moment().format('dddd').toLowerCase())
      console.log("Getting the day information:", getDayInformation);
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

  let options = '';

  for(let i = 1; i < 100; i++)
  {
      options += `<option value${i}" className="co">${i}</option>`
  }

  useEffect(() => 
  {
    let qtySelect = document.querySelectorAll(`.qty-select`)  
    for(let i = 0; i < qtySelect.length; i++)
    {
      qtySelect[i].innerHTML = options
    }
  }, [isitemclicked,isquickviewclicked,iscartbtnclicked])

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
    const dayNumber = moment().day();

    // Get the current day name
    const dayName = moment().format('dddd');

    console.log("Day Name", dayName, "Day number", dayNumber);
    setDayname(dayName)
    setDaynumber(dayNumber)
    fetchMenu()
    const getSelectStore = window.localStorage.getItem('user_selected_store')
    if(getSelectStore === null)
    {
      setAtfirstload(true)
    }
    else
    {
      setPostcode(JSON.parse(window.localStorage.getItem('user_valid_postcode')))
      const parseToJSobj = JSON.parse(getSelectStore)
      setStoreGUID(parseToJSobj.display_id)
      setStoreName(parseToJSobj.store)

      const address = JSON.parse(window.localStorage.getItem('address'))
      const getDeliveryMatrix = JSON.parse(window.localStorage.getItem('delivery_matrix'))

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
      const cartDataFromLocalStorage = JSON.parse(window.localStorage.getItem('cart'))
      setCartdata((cartDataFromLocalStorage === null) ? [] : cartDataFromLocalStorage)
    }
  }, []);

  console.log("Cart Data:", cartdata);
  return (
    <html lang="en">
      <HeadMetaData />
      <body className="body-tag">
        <HomeContext.Provider 
          value={{
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
          {isgobtnclicked && <AvailableStoresShow />}
          <Footer />
        </HomeContext.Provider>
      </body>
      {/* <div>
        <div className="loader"></div>
      </div> */}
    </html>
  )
}

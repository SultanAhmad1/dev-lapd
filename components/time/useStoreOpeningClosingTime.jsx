import { BRAND_SIMPLE_GUID, DELIVERY_ID } from "@/global/Axios";
import { listtime } from "@/global/Time";
import moment from "moment/moment";

export default function useStoreOpeningClosingTime() {

    let resultScheduleMessage = "";
    let resultScheduleEnabled = 0;
    let resultScheduleIsReady = false;
    let resultCheckoutReadyAfterSchedule = false;
    let resultScheduleTime = "";
    let resultStoreCurrentOrNextDayOpeningTime = "";
    let resultStoreCurrentOrNextDayClosingTime = "";

    // let resultStoreToDayOpeningTime = "";
    // let resultStoreToDayClosingTime = "";
    let resultIsScheduleForToday = 0;

    const jsMenu = JSON.parse(window.localStorage.getItem(`${BRAND_SIMPLE_GUID}menus`))

    
    const getDay = JSON.parse(jsMenu.menus);
    console.log("store opening closing time: ",getDay);
    
    const dayName = moment().format("dddd").toLowerCase();

    // 1) Find today’s availability entry
    const findToday = getDay?.[0]?.service_availability?.find(day =>
        day.day_of_week.toLowerCase().includes(dayName)
    );

    // if (!findToday) {
    //     // No service today
    //     return;
    // }
            
    const period = findToday.time_periods?.[0];
    
    // if (!period) {
    //     // No defined time slot
    //     return;
    // }

    // 2) Build Moments for start/end **today** at those clock times:
    const now = moment(); // full date and time now

    const currentTime = moment().tz("Europe/London").format("HH:mm");

    const getStartTime = moment.utc(period.start_time, "HH:mm", "Europe/London").format("HH:mm")
    let getEndTime = moment.utc(period.end_time, "HH:mm", "Europe/London").format("HH:mm")
    const getNextDayDetail = getDay?.[0]?.service_availability?.find((dayInformation) => dayInformation.day_of_week === moment().add(1, 'days').format("dddd").toLowerCase());

    // delivery_cut_off and collection_cut_off will be used with end_time not with start_time.
    const getFilter = JSON.parse(window.localStorage.getItem(`${BRAND_SIMPLE_GUID}filter`))
    
    getEndTime = moment.utc(period.end_time,"HH:mm", "Europe/London").subtract((getFilter?.id === DELIVERY_ID) ? period.delivery_cut_off : period.collection_cut_off, "minute").format("HH:mm")

    const latestCurrentTime = moment().tz("Europe/London");
    const endTime = moment.tz(period.end_time, "HH:mm", "Europe/London");

    const updatedDifferentInMinutes = endTime.diff(latestCurrentTime, "minutes");
    // for today delivery or collection

    if(getFilter?.id === DELIVERY_ID)
    {
        // for delivery, i need to check the schedule time for today, and check the schedule is enable or not.
        resultScheduleEnabled = parseInt(period.is_delivery_schedule) === parseInt(0) && 1
        resultScheduleIsReady = parseInt(period.is_delivery_schedule) === parseInt(0) ? true : false
    }
    else
    {
        // for collection, i need to check the schedule time for today, and check the schedule is enable or not.
        resultScheduleEnabled = parseInt(period.is_collection_schedule) === parseInt(0) && 2
        resultScheduleIsReady = parseInt(period.is_collection_schedule) === parseInt(0) ? true : false
    }

    const getTodayDetails = getDay?.[0]?.service_availability?.find((dayInformation) => {
        return dayInformation.day_of_week === moment().format("dddd").toLowerCase();
    });

    if (getTodayDetails) {
        const newDeliveryOrCollection = getTodayDetails.time_periods?.[0];
        // first check the order type is delivery or collection.
        let customBeforeAddMinutes = (getFilter?.id === DELIVERY_ID) ?  newDeliveryOrCollection?.time_to : newDeliveryOrCollection?.collection_after_opening_from;
        const customBeforeUpdateScheduleTime = moment.utc(currentTime, "HH:mm", "Europe/London").add(customBeforeAddMinutes,'minutes').format("HH:mm")
        
        resultScheduleTime = customBeforeUpdateScheduleTime

        const nextAvailableTime = listtime.find(item => 
            moment(item.time, "HH:mm").isSameOrAfter(moment(customBeforeUpdateScheduleTime, "HH:mm"))
        );
    
        resultStoreCurrentOrNextDayOpeningTime  =nextAvailableTime?.time
    }
    resultScheduleIsReady = false
    resultCheckoutReadyAfterSchedule = false
    resultScheduleMessage = ""
    

    // for today delivery or collection end.
    if(getStartTime >= currentTime)
    {
        // i need to check the schedule time for today, and check the schedule time check is true/false.
        resultIsScheduleForToday = 1
        if(getFilter?.id === DELIVERY_ID)
        {
            // for delivery, i need to check the schedule time for today, and check the schedule is enable or not.
            resultScheduleEnabled = parseInt(period.is_delivery_schedule) === parseInt(0) && 1
            resultScheduleIsReady = parseInt(period.is_delivery_schedule) === parseInt(0) ? true : false 
        }
        else
        {
            // for collection, i need to check the schedule time for today, and check the schedule is enable or not.
            resultScheduleEnabled = parseInt(period.is_collection_schedule) === parseInt(0) && 2
            resultScheduleIsReady = parseInt(period.is_collection_schedule) === parseInt(0) ? true : false
        }
    
        const getTodayDetails = getDay?.[0]?.service_availability?.find((dayInformation) => {
            return dayInformation.day_of_week === moment().format("dddd").toLowerCase();
        });


        if (getTodayDetails) {
            const newDeliveryOrCollection = getTodayDetails.time_periods?.[0];
            // first check the order type is delivery or collection.
            let customBeforeAddMinutes = (getFilter?.id === DELIVERY_ID) ?  newDeliveryOrCollection?.time_to : newDeliveryOrCollection?.collection_after_opening_from;

            const customBeforeUpdateScheduleTime = moment.utc(newDeliveryOrCollection.start_time, "HH:mm", "Europe/London").add(customBeforeAddMinutes,'minutes').format("HH:mm")
            
            resultScheduleTime = customBeforeUpdateScheduleTime
            resultStoreCurrentOrNextDayOpeningTime = customBeforeUpdateScheduleTime
        }

        resultScheduleIsReady = true
        resultCheckoutReadyAfterSchedule = true
        resultScheduleMessage = "later today"
    
    }
    // This block of code will check the schedule time for next day, and check the schedule time check is true/false.
    // else if(currentTime >= getEndTime) // from here need to check the system.
    else
    {
        const getNextDayDetail = getDay?.[0]?.service_availability?.find((dayInformation) => {
            return dayInformation.day_of_week === moment().add(1, 'days').format("dddd").toLowerCase();
        });
        
        const getCurrentDayDetail = getDay?.[0]?.service_availability?.find((dayInformation) => {
            return dayInformation.day_of_week === moment().add('days').format("dddd").toLowerCase();
        });

        // checking after adding minutes, current day is bigger or not.
        const currentDeliveryCollection = getCurrentDayDetail.time_periods?.[0];
        // let customUpdateAddMinutes = (getFilter?.id === DELIVERY_ID) ?  currentDeliveryCollection.time_to : currentDeliveryCollection.collection_after_opening_from;
        let customUpdateAddMinutes = (getFilter?.id === DELIVERY_ID) ?  0 : currentDeliveryCollection.collection_after_opening_from;

        const checkCurrentEndTime =  moment.utc(currentDeliveryCollection.end_time, "HH:mm", "Europe/London").add(customUpdateAddMinutes,'minutes').format("HH:mm")


        const customCurrentEndTime =  (checkCurrentEndTime === "00:00") ? "23:59" : checkCurrentEndTime

        console.log(customUpdateAddMinutes, "check the current end time: ", customCurrentEndTime);
        
        const customCurrentOpeningTime = moment.utc(currentDeliveryCollection.start_time, "HH:mm", "Europe/London").add(customUpdateAddMinutes,'minutes').format("HH:mm")

        // get the two dates difference
        const todayDate = moment().tz("Europe/London").format("YYYY-MM-DD");

        const startDateTime = moment(`${todayDate} ${currentTime}`, "YYYY-MM-DD HH:mm");
        const endDateTime = moment(`${todayDate} ${customCurrentEndTime}`, "YYYY-MM-DD HH:mm");

        const differenceInMinutes = endDateTime.diff(startDateTime, 'minutes')
        const getTheMinutes = (getFilter?.id === DELIVERY_ID ? currentDeliveryCollection.time_to : currentDeliveryCollection.collection_after_opening_from)

        if((currentTime >= customCurrentEndTime || currentTime <= customCurrentEndTime))
        {
            // For Delivery 
            if(getFilter?.id === DELIVERY_ID && updatedDifferentInMinutes <= period.delivery_cut_off)
            {
                console.log("i am here inside the 30 minutes", updatedDifferentInMinutes,  period.delivery_cut_off);
                
                resultScheduleEnabled = 1
                resultScheduleIsReady = true
                resultCheckoutReadyAfterSchedule = true
                resultScheduleMessage =getNextDayDetail.day_of_week // need to work from there.
            }
            else if(updatedDifferentInMinutes <= period.collection_cut_off)
            {
                console.log("i am here inside the 15 minutes", updatedDifferentInMinutes, period.collection_cut_off);
                resultScheduleEnabled = 2
                resultScheduleIsReady = true
                resultCheckoutReadyAfterSchedule = true
                resultScheduleMessage = getNextDayDetail.day_of_week  // need to work from there.
            }
            // for collection
            const getCurrentTime = moment().tz("Europe/London").format("HH:mm");
            resultStoreCurrentOrNextDayOpeningTime = customCurrentOpeningTime >= getCurrentTime ? customCurrentOpeningTime : getCurrentTime 
            resultStoreCurrentOrNextDayClosingTime = customCurrentEndTime 
        }
        else 
        if (getNextDayDetail) {
            const newNextDeliveryOrCollection = getNextDayDetail.time_periods?.[0];
            
            // Next day opening time
            // resultStoreToDayClosingTime = getCurrentDayDetail?.time_periods?.[0]?.start_time
            // Next day closing time
            // resultStoreToDayClosingTime = getCurrentDayDetail?.time_periods?.[0]?.end_time
            
            let customUpdateAddMinutes = (getFilter?.id === DELIVERY_ID) ?  newNextDeliveryOrCollection?.time_to : newNextDeliveryOrCollection?.collection_after_opening_from;
            const customUpdateEndTime = moment.utc(newNextDeliveryOrCollection.end_time, "HH:mm", "Europe/London").add(customUpdateAddMinutes,'minutes').format("HH:mm")
            const customUpdateOpeningTime = moment.utc(newNextDeliveryOrCollection.start_time, "HH:mm", "Europe/London").add(customUpdateAddMinutes,'minutes').format("HH:mm")

            resultStoreCurrentOrNextDayOpeningTime  =   customUpdateOpeningTime
            resultStoreCurrentOrNextDayClosingTime  = customUpdateEndTime === "00:00" ? moment.utc(customUpdateEndTime, "HH:mm", "Europe/London").subtract(15,'minutes').format("HH:mm"): customUpdateEndTime
        
            let customBeforeAddMinutes = (getFilter?.id === DELIVERY_ID) ?  newNextDeliveryOrCollection?.time_to : newNextDeliveryOrCollection?.collection_after_opening_from;
            const customBeforeUpdateScheduleTime = moment.utc(newNextDeliveryOrCollection.start_time, "HH:mm", "Europe/London").add(customBeforeAddMinutes,'minutes').format("HH:mm")
            resultScheduleTime = customBeforeUpdateScheduleTime
            resultScheduleIsReady = true
            resultCheckoutReadyAfterSchedule = true
            resultScheduleMessage = getNextDayDetail.day_of_week // need to work from there.
            resultIsScheduleForToday = 2
        }

    }

    return {
        resultScheduleMessage,
        resultScheduleEnabled,
        resultScheduleIsReady,
        resultCheckoutReadyAfterSchedule,
        resultScheduleTime,
        resultStoreCurrentOrNextDayOpeningTime,
        resultStoreCurrentOrNextDayClosingTime,
        // resultStoreToDayClosingTime,
        resultIsScheduleForToday,
    }
}

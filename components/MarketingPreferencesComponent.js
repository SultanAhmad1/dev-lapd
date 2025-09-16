'use client'
import React, { useContext, useEffect, useState } from "react";
import Header from "./Header";
import Banner from "./Banner";
import Footer from "./Footer";
import HomeContext from "@/contexts/HomeContext";
import { ContextCheckApi } from "@/app/layout";
import { BRAND_GUID, IMAGE_URL_Without_Storage } from "@/global/Axios";
import { usePostMutationHook } from "./reactquery/useQueryHook";

export default function MarketingPreferencesComponent() 
{
  const {
    websiteModificationData,
    selectedStoreDetails,
  } = useContext(HomeContext);

  const {
    setMetaDataToDisplay, metaDataToDisplay
  } = useContext(ContextCheckApi)

  useEffect(() => {
    if (websiteModificationData) {
      setMetaDataToDisplay((prevData) => ({
        ...prevData,
        title: `Marketing Preferences - ${websiteModificationData?.brand?.name}`,
        contentData: "",
      }));
    }
  }, [metaDataToDisplay, setMetaDataToDisplay, websiteModificationData]);


  const [form, setForm] = useState({
    viaEmail: true,
    viaPhone: false,
    email: "",
    phone: "",
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);


  const update = (patch) => setForm((f) => ({ ...f, ...patch }));


  // const validate = () => {
  //   const e = {};
  //   if (form.viaEmail) {
  //     if (!form.email.trim()) e.email = "Email is required";
  //     else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email)) e.email = "Enter a valid email";
  //   }
  //   if (form.viaPhone) {
  //     if (!form.phone.trim()) e.phone = "Phone is required";
  //     else if (!/^\+?[0-9\s()-]{7,}$/.test(form.phone)) e.phone = "Enter a valid phone number";
  //   }
  //   if (!form.viaEmail && !form.viaPhone) e.channel = "Choose at least one option";
  //   return e;
  // };

  const validate = () => {
    const e = {};

    if (form.viaEmail) {
      if (!form.email.trim()) e.email = "Email is required";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email))
        e.email = "Enter a valid email";
    }

    if (form.viaPhone) {
      if (!form.phone.trim()) e.phone = "Phone is required";
      else if (!/^\+?[0-9\s()-]{7,}$/.test(form.phone))
        e.phone = "Enter a valid phone number";
    }

    // 🔴 New rule: if both fields are empty, show an error
    if (!form.email.trim() && !form.phone.trim()) {
      e.channel = "Please provide at least an email or a phone number";
    }

    return e;
  };


  const onSubmit = (ev) => {
    ev.preventDefault();
    const e = validate();

    setErrors(e);
    if (Object.keys(e).length === 0) {
      const submitData = {
        email: form.email,
        phone: form.phone,
        storeId: BRAND_GUID,
        market_by_sms: form.viaPhone ? 1 : 0, 
        market_by_email: form.viaEmail ? 1 : 0,
      }
      marketingMutate(submitData)
      setSubmitted(true);
      // pretend to send
      
    }
  };
  
  const onMarketingSuccess = (data) => {
    setTimeout(() => setSubmitted(false), 2000);
  }

  const onMarketError = (error) => {

    const {message} = error?.response?.data
    setErrors({
      channel: message
    })
    setTimeout(() => setSubmitted(false), 2000);
  }

  const{isLoading: marketingLoading, isError: marketingError, mutate: marketingMutate} = usePostMutationHook('key-marketing-preferences',`/website-marketing-preferences`,onMarketingSuccess, onMarketError);

  const inputBase =
  "mt-1 w-full rounded-2xl border bg-white/50 px-4 py-3 text-sm outline-none transition focus:ring-4 disabled:opacity-50 disabled:cursor-not-allowed " +
  "border-slate-300 focus:border-slate-600 focus:ring-slate-200";

  return(
    <>
      <Header />
      <Banner />

      {/* <div className={`w-full flex items-center justify-center text-center ${websiteModificationData?.allergens ? "" : "h-[40vh]"}`}> */}
      <div className={`w-full flex flex-col items-center justify-center text-center py-10 px-4 sm:px-6 lg:px-8 bg-slate-50`}>
          {/* {
              websiteModificationData?.allergens === null ?
                  <h1 className="font-bold text-lg">
                      Allergens Text...,
                  </h1>
              :
                  <div dangerouslySetInnerHTML={{ __html: websiteModificationData?.allergens?.allergens }} />
          } */}

          {/* <h1 className="text-4xl font-bold mb-4">
            Our unsubscribing portal is not working right now.
          </h1>
          <p className="text-base">
            Please can you send us a message at <strong>hi@lapdfood.co.uk</strong> with the contact details you would like us to remove from our marketing
          </p> */}

            
          <form
            onSubmit={onSubmit}
            className="w-full max-w-xl rounded-3xl bg-white shadow-xl ring-1 ring-black/5 p-6 sm:p-8"
          >
            <div className="mb-6">
              <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Marketing Preferences</h1>
              {/* <p className="mt-1 text-sm text-slate-500">Select how you had like to be get marketing, then fill in the details.</p> */}
            </div>

            {/* Channels */}
            <fieldset className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <label className={`flex items-center gap-3 rounded-2xl border p-4 cursor-pointer transition shadow-sm hover:shadow ${
                  form.viaEmail ? "border-slate-900/10 bg-slate-50" : "border-slate-200 bg-white"
                }`}>
                <input
                  type="checkbox"
                  checked={form.viaEmail}
                  onChange={(e) => update({ viaEmail: e.target.checked })}
                  className="h-5 w-5 rounded border-slate-300 text-slate-700 focus:ring-slate-400"
                />
                <div>
                  <div className="font-medium text-slate-900">Email</div>
                  <div className="text-xs text-slate-500">Do not use my email for marketing preferences.</div>
                </div>
              </label>

              <label className={`flex items-center gap-3 rounded-2xl border p-4 cursor-pointer transition shadow-sm hover:shadow ${
                  form.viaPhone ? "border-slate-900/10 bg-slate-50" : "border-slate-200 bg-white"
                }`}>
                <input
                  type="checkbox"
                  checked={form.viaPhone}
                  onChange={(e) => update({ viaPhone: e.target.checked })}
                  className="h-5 w-5 rounded border-slate-300 text-slate-700 focus:ring-slate-400"
                />
                <div>
                  <div className="font-medium text-slate-900">Phone</div>
                  <div className="text-xs text-slate-500">Do not use my phone number for marketing preferences.</div>
                </div>
              </label>
            </fieldset>
            {errors.channel && (
              <p className="mt-2 text-sm text-rose-600">{errors.channel}</p>
            )}

            {/* Inputs */}
            <div className="mt-6 grid grid-cols-1 gap-5">
              <div>
                <label className="text-sm font-medium text-slate-700">Email address</label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  // disabled={!form.viaEmail}
                  onChange={(e) => update({ email: e.target.value })}
                  className={`${inputBase} ${errors.email ? "border-rose-300 focus:border-rose-500 focus:ring-rose-100" : ""}`}
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-rose-600">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700">Phone number</label>
                <div className="relative">
                  <input
                    type="tel"
                    placeholder="e.g. 03XXXXXXXXX"
                    value={form.phone}
                    // disabled={!form.viaPhone}
                    onChange={(e) => update({ phone: e.target.value })}
                    className={`${inputBase} pr-10 ${errors.phone ? "border-rose-300 focus:border-rose-500 focus:ring-rose-100" : ""}`}
                  />
                  <span className="pointer-events-none absolute inset-y-0 right-3 grid place-items-center text-slate-400">
                    {/* phone icon */}
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                      <path fillRule="evenodd" d="M1.5 4.5A3 3 0 014.5 1.5h.75A2.25 2.25 0 017.5 3.75v2.25a2.25 2.25 0 01-2.25 2.25H4.22a.75.75 0 00-.53 1.28l2.83 2.83a.75.75 0 001.06 0l1.06-1.06a2.25 2.25 0 013.182 0l2.829 2.83a2.25 2.25 0 010 3.182l-1.06 1.06a.75.75 0 01-1.06 0l-6.01-6.01a.75.75 0 00-1.28.53v1.03A2.25 2.25 0 013.75 18H1.5A3 3 0 01-1.5 15v-9z" clipRule="evenodd" />
                    </svg>
                  </span>
                </div>
                {errors.phone && (
                  <p className="mt-1 text-xs text-rose-600">{errors.phone}</p>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="mt-7 flex flex-col-reverse items-center justify-between gap-3 sm:flex-row">
              <p className="text-xs text-slate-500">
                By continuing you agree to our
                <a href="#" className="font-medium text-slate-700 underline-offset-4 hover:underline"> terms</a>.
              </p>
              <button
                type="submit"
                style={{
                  backgroundColor:
                    websiteModificationData?.websiteModificationLive?.json_log?.[0]
                      ?.buttonBackgroundColor || 'black',
                  color:
                    websiteModificationData?.websiteModificationLive?.json_log?.[0]
                      ?.buttonColor || 'white',
                }}
                className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-5 py-3 text-sm font-medium text-white shadow-lg shadow-slate-900/20 transition hover:brightness-110 focus:outline-none focus:ring-4 focus:ring-slate-300 active:translate-y-px"
              >
                {submitted ? (
                  <span className="inline-flex items-center gap-2">
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" opacity="0.25" />
                      <path d="M22 12a10 10 0 00-10-10" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                    </svg>
                    Processing...
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-2">
                    Submit
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                      <path fillRule="evenodd" d="M16.72 11.47a.75.75 0 010 1.06l-6 6a.75.75 0 11-1.06-1.06L14.19 12 9.66 7.53a.75.75 0 011.06-1.06l6 6z" clipRule="evenodd" />
                    </svg>
                  </span>
                )}
              </button>
            </div>
          </form>


      </div>
      <Footer />
    </>
  )
}

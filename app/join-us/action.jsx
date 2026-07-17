export async function submitJoinUs(form) {
    try {
        const formData = new FormData(form);

        let phone = formData.get("phone");
        const email = formData.get("email");
        const fullName = formData.get("fullName");
        const location = formData.get("store") || "";
        const brand = formData.get("brand");
        const marketingConsent = formData.get("marketingConsent") === "on" ? 1 : 0;

        // ---------------------------
        // PHONE CLEANING + VALIDATION
        // ---------------------------

        if (!phone) {
            return {
                success: false,
                field: "phone",
                message: "Phone number is required",
            };
        }

        phone = phone.toString().trim();

        // replace +44 → 0
        if (phone.startsWith("+44")) {
            phone = "0" + phone.slice(3);
        }

        // remove non-digits
        phone = phone.replace(/\D/g, "");

        // ensure starts with 0
        if (phone.length > 0 && phone[0] !== "0") {
            phone = "0" + phone;
        }

        // limit to 11 digits
        phone = phone.slice(0, 11);

        // final validation rule
        const phoneRegex = /^0\d{10}$/;

        if (!phoneRegex.test(phone)) {
            return {
                success: false,
                field: "phone",
                message: "Invalid phone number (must be 11 digits starting with 0)",
            };
        }

        // ---------------------------
        // PAYLOAD
        // ---------------------------
        const payload = {
            phone,
            email,
            fullName,
            location,
            brand,
            marketingConsent
        };

        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/join-us`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        const data = await response.json();

        console.log("success data:", data);
        
        return {
            success: response.ok,
            data,
            message: data?.message || "A discount coupon has been sent to your email address."
        };
    } catch (error) {
        return {
            success: false,
            message: error.message || "Something went wrong",
        };
    }
}
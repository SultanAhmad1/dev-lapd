"use server";

export default async function patchReview(prevState, formData) {

    const rating = formData.get("rating");
    const tags = formData.getAll("selectedTags"); // getAll because checkboxes
    const comment = formData.get("comment");
    const orderId = formData.get("orderId")

    // Get all product review keys dynamically
    const productReviews = [];

    for (const [key, value] of formData.entries()) {
        // Check for keys starting with "review_" (product reviews)
        if (key.startsWith("review_")) {
            const productId = key.replace("review_", "");
            productReviews.push({
                product_id: productId,
                review: parseInt(value) // 0 = dislike, 1 = like
            });
        }
    }
    
    /**
     * food_quality_rating_data = great taste
     * package_rating_data = good packaging
     * deilvery_rating_data = fast delivery
     * website_rating_data = hot & fresh
     * individual_clicked_on_individual_order_review
     */
    const payload = {
        rating: parseInt(rating),
        selectedTags: tags,
        comment,
        productReviews
    };

    const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/reviews/${orderId}`,
        {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
            cache: "no-store",
        }
    );

    const data = await res.json();
    console.log("Payload to send to API:", data);

    // Now you can send it to your API via fetch/axios
    // Example:
    // await fetch(`${BRAND_GUID}/reviews`, {
    //     method: "POST",
    //     body: JSON.stringify(payload),
    //     headers: { "Content-Type": "application/json" },
    // });
}
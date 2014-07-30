var biggestHeight = "0";
// Loop through elements children to find & set the biggest height
$("#banner_img_gallery > li").each(function() {
    // If this elements height is bigger than the biggestHeight
    if ($(this).height() > biggestHeight) {
        // Set the biggestHeight to this Height
        biggestHeight = $(this).height();
    }
});

// Set the container height
$("#banner_img_gallery").height(biggestHeight);

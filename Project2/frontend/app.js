
const userInputs = document.querySelectorAll("select, input");
const table = document.querySelector("table");
const noRecordMessage = document.querySelector(".noRecordMessage");
const eventCard = document.querySelector(".eventCard");
const venueCard = document.querySelector(".venueCard");
const showVenueDetail = document.querySelector(".showVenueDetails");
const locationInput = document.getElementById("locationInput");
const locationInputContainer = document.getElementById("locationInputContainer")
const autoDetectCheckbox = document.getElementById("auto-detect-checkbox");
const clearButton = document.getElementById("clearButton");
const posts = document.getElementById("posts");
const postTemplate = document.getElementById("template-for-post");
const searchButton = document.getElementById("searchButton");
const tableBody = table.querySelector("tbody");

// columns to sort
const eventHeader = document.getElementById("eventHeader");
const genreHeader = document.getElementById("genreHeader");
const venueHeader = document.getElementById("venueHeader");

const ipinfoApiLink = "https://ipinfo.io/?token=f7b734d17201ad";
const geoCodeApi = "https://maps.googleapis.com/maps/api/geocode/json?";

const eventsSearchApi = "https://hfisuadhfuhyu-738784.wl.r.appspot.com/eventsSearch";
const eventsDetailApi = "https://hfisuadhfuhyu-738784.wl.r.appspot.com/eventsDetail";
const venueDetailApi = "https://hfisuadhfuhyu-738784.wl.r.appspot.com/venueDetail";

// const eventsSearchApi = "http://127.0.0.1:8000/eventsSearch";
// const eventsDetailApi = "http://127.0.0.1:8000/eventsDetail";
// const venueDetailApi = "http://127.0.0.1:8000/venueDetail";

function makeTableVisible() {
    table.classList.remove("none");
}

function makeTableInvisible() {
    table.classList.add("none");
}

function makeNoRecordMessageVisible() {
    noRecordMessage.classList.remove("none");
}

function makeNoRecordMessageInvisible() {
    noRecordMessage.classList.add("none");
}

function makeEventCardVisible() {
    eventCard.classList.remove("none");
}

function makeEventCardInvisible() {
    eventCard.classList.add("none");
}

function makeVenueCardVisible() {
    venueCard.classList.remove("none");
}

function makeVenueCardInVisible() {
    venueCard.classList.add("none");
}

function makeShowVenueDetailVisible() {
    showVenueDetail.classList.remove("none");
}

function makeShowVenueDetailInvisible() {
    showVenueDetail.classList.add("none");
}

function autoDetectCheckboxHandler() {
    if(autoDetectCheckbox.checked === false) {
        locationInputContainer.classList.remove("none");
        locationInput.disabled = false;
        // console.log(locationInputContainer.classList)
    } else {
        locationInputContainer.classList.add("none");
        locationInput.value = "";
        locationInput.disabled = true;
        // console.log(locationInputContainer.classList)
    }
}
function clearButtonHandler() {
    userInputs[0].value = "";
    userInputs[1].value = "";
    userInputs[2].value = "Default";

    userInputs[3].checked = false;

    userInputs[4].value = "";
    userInputs[4].disabled = false;
    locationInputContainer.classList.remove("none");

    makeTableInvisible();
    makeNoRecordMessageInvisible();
    makeEventCardInvisible();
    makeVenueCardInVisible();
    makeShowVenueDetailInvisible();
}

async function getLocation() {
    // console.log(autoDetectCheckbox.ckecked)
    if(autoDetectCheckbox.checked === true) {
        // console.log(ipinfoApiLink)
        const ipinfoResponse = await axios.get(ipinfoApiLink);
        // console.log(ipinfoResponse.data);
        const temp = await ipinfoResponse.data["loc"].split(',');
        const locList = temp.map(function (x) {
            return parseFloat(x);
        });
        return locList;
    } else {
        const locationInputValue = locationInput.value;
        const params = {
            address: locationInputValue,
            key: "AIzaSyBue9gLRaZkFW2ESgjqV-px0WP3N5PeUy4",
        }
        const geoCodeResponse = await axios.get(geoCodeApi, {params: params});
        if(geoCodeResponse.data.status === "ZERO_RESULTS") {
            return null;
        }
        const temp = geoCodeResponse.data.results[0].geometry.location;
        const locs = [
            temp.lat,
            temp.lng,
        ];
        const locList = locs.map(function (x) {
            return parseFloat(x);
        });
        return locList;
    }
}

async function searchButtonHandler() {
    makeTableInvisible();
    makeNoRecordMessageInvisible();
    makeEventCardInvisible();
    makeVenueCardInVisible();
    makeShowVenueDetailInvisible();

    const apikey = "fFWL1pAuuxApZPwgMkxGHr6CEnUPLz7o";
    
    let radius = "10";
    console.log(userInputs[1].value)
    if(userInputs[1].value != ""){
        radius = userInputs[1].value;
    }

    const categoryInputValue = userInputs[2].value;
    let location = "";
    if(autoDetectCheckbox.checked === false){
        location = locationInput.value;
    }
    let segmentId = ""

    if(categoryInputValue === "Music"){
        segmentId = "KZFzniwnSyZfZ7v7nJ";
    }
    if(categoryInputValue === "Sports"){
        segmentId = "KZFzniwnSyZfZ7v7nE";
    }
    if(categoryInputValue === "Arts & Theatre"){
        segmentId = "KZFzniwnSyZfZ7v7na";
    }
    if(categoryInputValue === "Film"){
        segmentId = "KZFzniwnSyZfZ7v7nn";
    }
    if(categoryInputValue === "Miscellaneous"){
        segmentId = "KZFzniwnSyZfZ7v7n1";
    }

    const unit = "miles";
    const keyword = userInputs[0].value;
    
    if(keyword !== ""){
        if(location !== "" || autoDetectCheckbox.checked){
            try {
                const locList = await getLocation();
                if(locList === null){
                    makeNoRecordMessageVisible();
                    makeEventCardInvisible();
                    makeVenueCardInVisible();
                    makeShowVenueDetailInvisible();
                    makeTableInvisible();

                } else {
                    const latitude = await locList[0];
                    const longitude = await locList[1];
                    const geoPoint = Geohash.encode(latitude, longitude, 7);
                    console.log(geoPoint);
                    const params = {
                        apikey: apikey,
                        geoPoint: geoPoint,
                        radius: radius,
                        segmentId: segmentId,
                        unit: unit,
                        keyword: keyword,
                    };
    
                    while(posts.firstChild) {
                        posts.removeChild(posts.lastChild);
                    }
                    const response = await axios.get(eventsSearchApi, {params: params});
                    console.log(response)
                    if(typeof response.data._embedded === "undefined") {
                        makeNoRecordMessageVisible();
                        makeEventCardInvisible();
                        makeVenueCardInVisible();
                        makeShowVenueDetailInvisible();
                        makeTableInvisible();
                        return;
                    }
                    const postList = response.data._embedded.events;
                    console.log(response.data);
                    // console.log(postTemplate)
    
                    if(typeof postList === "undefined") {
                        makeNoRecordMessageVisible();
                        makeEventCardInvisible();
                        makeVenueCardInVisible();
                        makeShowVenueDetailInvisible();
                        makeTableInvisible();
                    } else if(postList.length === 0) {
                        makeNoRecordMessageVisible();
                        makeEventCardInvisible();
                        makeVenueCardInVisible();
                        makeShowVenueDetailInvisible();
                        makeTableInvisible();
                    } else {
                        makeNoRecordMessageInvisible();
                        for (let post of postList){
                            const postElement = document.importNode(postTemplate.content, true);
                            const Date = postElement.children[0].querySelector(".date");
                            if(typeof post.dates != "undefined"){
                                if(typeof post.dates.start != "undefined"){                                   
                                    if(typeof post.dates.start.localDate != "undefined" && typeof post.dates.start.localTime == "undefined"){
                                        Date.innerHTML = `${post.dates.start.localDate}`;
                                    }
                                    if(typeof post.dates.start.localDate == "undefined" && typeof post.dates.start.localTime != "undefined"){
                                        Date.innerHTML = `${post.dates.start.localTime}`;
                                    }
                                    if(typeof post.dates.start.localDate != "undefined" && typeof post.dates.start.localTime != "undefined"){
                                        Date.innerHTML = `${post.dates.start.localDate}<br />${post.dates.start.localTime}`;
                                    }
                                }
                            }
                            
                            const Icon = postElement.children[0].querySelector(".icon");
                            if(typeof post.images != "undefined"){
                                Icon.innerHTML = `<img src=${post.images[0].url} class="imageContent" />`;
                            }
                            
                            const Event = postElement.children[0].querySelector(".event");
                            if(typeof post.name != "undefined") {
                                // 'innerHTML' clear all HTML in Event first, so even though bind will always add 1 id params to the function 
                                // but the function each time works on a new HTML element,and its original binded params is 0
                                Event.innerHTML = `<a href="#eventCard" class="eventCardLink">${post.name}</a>`;
                                Event.querySelector(".eventCardLink").addEventListener("click", getEventDetails.bind(null, post.id));
                            }

                            const Genre = postElement.children[0].querySelector(".genre");
                            if(typeof post.classifications != "undefined"){
                                Genre.textContent = post.classifications[0].segment.name;
                            }

                            const Venue = postElement.children[0].querySelector(".venue");
                            if(typeof post._embedded != "undefined"){
                                Venue.textContent = post._embedded.venues[0].name;
                            }
                            
                            posts.appendChild(postElement);                            
                        }
                        makeTableVisible();
                        rows = posts.querySelectorAll("tr");
                        // table.scrollIntoView(false);
                    }
                }

            } catch (error) {
                alert(error.message);
            }
        }
    }
}
let sortOrders = [1, 1, 1];

const eventColumnSort = sortColumns.bind(null, 2);
const genreColumnSort = sortColumns.bind(null, 3);
const venueColumnSort = sortColumns.bind(null, 4);

function sortColumns(index) {

    // use 1 when ascends, -1 when descends
    const sortOrder = sortOrders[index - 2];

    const newRows = Array.from(rows);
    newRows.sort(function (rowA, rowB) {
        const A = rowA.querySelectorAll("td")[index].innerHTML;
        const B = rowB.querySelectorAll("td")[index].innerHTML;

        if(A > B){
            return 1 * sortOrder;
        }
        if(A < B){
            return -1 * sortOrder;
        }
        if(A === B) {
            return 0;
        }
    });

    rows.forEach(function(row) {
        tableBody.removeChild(row);
    });

    newRows.forEach(function(newRow) {
        tableBody.appendChild(newRow);
    });

    sortOrders[index - 2] = ((sortOrder === 1) ? -1 : 1);

}

async function getEventDetails(id) {
    console.log(id);
    const params = {
        id: id,
        apikey: "fFWL1pAuuxApZPwgMkxGHr6CEnUPLz7o",
    };
    const eventsDetailResponse = await axios.get(eventsDetailApi, {params: params});
    console.log(eventsDetailResponse);

    const eventCardHeader = document.getElementById("eventCardHeader");
    eventCardHeader.classList.add("none");
    const eventCardHeaderContent = document.getElementById("eventCardHeaderContent");
    if(typeof (await eventsDetailResponse.data.name) != "undefined"){
        eventCardHeaderContent.textContent = await eventsDetailResponse.data.name;
        // console.log(typeof await eventsDetailResponse.data.name);
        // console.log(typeof "");
        if(eventCardHeaderContent.textContent != ""){
            eventCardHeader.classList.remove("none");
        }
    }

    const dateDiv = document.getElementById("dateDiv");
    dateDiv.classList.add("none");
    let date = document.getElementById("date");
    if(typeof (await eventsDetailResponse.data.dates) != "undefined"){
        if(typeof (await eventsDetailResponse.data.dates.start) != "undefined"){
            if(typeof (await eventsDetailResponse.data.dates.start.localDate) != "undefined" && typeof (await eventsDetailResponse.data.dates.start.localTime == "undefined")){
                date.textContent = await eventsDetailResponse.data.dates.start.localDate;
            }
            if(typeof (await eventsDetailResponse.data.dates.start.localDate == "undefined") && typeof (await eventsDetailResponse.data.dates.start.localTime != "undefined")){
                date.textContent = await eventsDetailResponse.data.dates.start.localTime;
            }
            if(typeof (await eventsDetailResponse.data.dates.start.localDate != "undefined") && typeof (await eventsDetailResponse.data.dates.start.localTime != "undefined")){
                date.textContent = await eventsDetailResponse.data.dates.start.localDate;
                date.textContent += " ";
                date.textContent += await eventsDetailResponse.data.dates.start.localTime;
            }
        }

    }   
    if(date.textContent != "") {
        dateDiv.classList.remove("none");
    }

    const artistDiv = document.getElementById("artistDiv");
    artistDiv.classList.add("none");
    artistDiv.innerHTML = "";
    artistDiv.insertAdjacentHTML("afterbegin",`<p class="eventCardSectionHeader">Artist/Team</p>`);
    if(typeof (await eventsDetailResponse.data._embedded) != "undefined"){
        if(typeof (await eventsDetailResponse.data._embedded.attractions) != "undefined"){
            const artists = (await eventsDetailResponse.data._embedded.attractions);
            const artistLength = artists.length;
            let flag = false;
            for(let i = 0; i < artistLength; i++){
                if(typeof artists[i].name != "undefined" && typeof artists[i].url != "undefined"){
                    if(flag === true){
                        artistDiv.insertAdjacentHTML("beforeend", `<span style="color: white;">&nbsp|&nbsp</span>`);                      
                    }
                    artistDiv.insertAdjacentHTML("beforeend", `<a href=${artists[i].url} class="artistLink" target="_blank">${artists[i].name}</a>`);
                    flag = true;
                } 
            }
            if(artistDiv.childElementCount >= 2){
                artistDiv.classList.remove("none");
            }
        }

    }


    const venueDiv = document.getElementById("venueDiv");
    venueDiv.classList.add("none");
    const venueContent = document.getElementById("venue");
    if(typeof (await eventsDetailResponse.data._embedded) != "undefined"){
        if(typeof (await eventsDetailResponse.data._embedded.venues) != "undefined"){
            venueContent.textContent = await eventsDetailResponse.data._embedded.venues[0].name;
            if(venueContent.textContent != ""){
                venueDiv.classList.remove("none");
            }
        }
    }


    const genreDiv = document.getElementById("genreDiv");
    genreDiv.classList.add("none");
    let genreContent = document.getElementById("genre");
    genreContent.textContent = ""; //eventsDetailResponse.data.classifications[0]
    if(typeof (await eventsDetailResponse.data.classifications) != "undefined"){
        if(typeof (await eventsDetailResponse.data.classifications[0].segment != "undefined") && (await eventsDetailResponse.data.classifications[0].segment.name !== "Undefined")){
            genreContent.textContent += await eventsDetailResponse.data.classifications[0].segment.name;
        }
        if(typeof (await eventsDetailResponse.data.classifications[0].genre) != "undefined" && (await eventsDetailResponse.data.classifications[0].genre.name) !== "Undefined") {
            genreContent.textContent += " | ";
            genreContent.textContent += await eventsDetailResponse.data.classifications[0].genre.name;
        }
        if(typeof (await eventsDetailResponse.data.classifications[0].subGenre) != "undefined" && (await eventsDetailResponse.data.classifications[0].subGenre.name) !== "Undefined") {
            genreContent.textContent += " | ";
            genreContent.textContent += await eventsDetailResponse.data.classifications[0].subGenre.name;
        }
        if(typeof (await eventsDetailResponse.data.classifications[0].type) != "undefined" && (await eventsDetailResponse.data.classifications[0].type.name) !== "Undefined") {
            genreContent.textContent += " | ";
            genreContent.textContent += await eventsDetailResponse.data.classifications[0].type.name;
        }
        if(typeof (await eventsDetailResponse.data.classifications[0].subType) != "undefined" && (await eventsDetailResponse.data.classifications[0].subType.name!== "Undefined")) {
            genreContent.textContent += " | ";
            genreContent.textContent += await eventsDetailResponse.data.classifications[0].subType.name;
        }
        if(genreContent.textContent != ""){
            genreDiv.classList.remove("none");
        }
    }

    const priceRangeDiv = document.getElementById("priceRangeDiv");
    priceRangeDiv.classList.add("none");
    const priceRange = document.getElementById("priceRange");
    if(typeof (await eventsDetailResponse.data.priceRanges) != "undefined"){
        priceRange.textContent = await eventsDetailResponse.data.priceRanges[0].min;
        priceRange.textContent += "-";
        priceRange.textContent += await eventsDetailResponse.data.priceRanges[0].max;
        priceRange.textContent += " USD";
        priceRangeDiv.classList.remove("none");
    }

    const ticketStatusDiv = document.getElementById("ticketStatusDiv");
    ticketStatusDiv.classList.add("none");
    if(typeof (await eventsDetailResponse.data.dates) != "undefined"){
        if(typeof (await eventsDetailResponse.data.dates.status) != "undefined"){
            if(typeof (await eventsDetailResponse.data.dates.status.code) != "undefined"){
                const statusInformation = await eventsDetailResponse.data.dates.status.code;
                const ticketStatus = document.getElementById("ticketStatus");
                ticketStatus.className = "eventCardSectionText statusRect";
                if(statusInformation === "onsale"){
                    ticketStatus.textContent = "On Sale";
                    ticketStatus.classList.add("onSale");
                    ticketStatusDiv.classList.remove("none");
                } else if(statusInformation === "cancelled"){
                    ticketStatus.textContent = "Canceled";
                    ticketStatus.classList.add("canceled");
                    ticketStatusDiv.classList.remove("none");
                } else if(statusInformation === "offsale"){
                    ticketStatus.textContent = "Off Sale";
                    ticketStatus.classList.add("offSale");
                    ticketStatusDiv.classList.remove("none");
                } else if(statusInformation === "rescheduled"){
                    ticketStatus.textContent = "Rescheduled";
                    ticketStatus.classList.add("rescheduled");
                    ticketStatusDiv.classList.remove("none"); 
                } else {
                    ticketStatus.textContent = "Postponed";
                    ticketStatus.classList.add("postponed");
                    ticketStatusDiv.classList.remove("none"); 
                }
            }
        }
    }

    const buyTicketAtDiv = document.getElementById("buyTicketAtDiv");
    buyTicketAtDiv.classList.add("none");
    const ticketmasterLink = document.getElementById("ticketmasterLink");
    if(typeof (await eventsDetailResponse.data.url) != "undefined"){
        ticketmasterLink.href = await eventsDetailResponse.data.url;
        buyTicketAtDiv.classList.remove("none");
    }

    const eventPictureContainer = document.getElementById("eventPictureContainer");
    eventPictureContainer.classList.add("none");
    const eventPicture = document.getElementById("eventPicture");
    eventPicture.src = "";
    if(typeof (await eventsDetailResponse.data.seatmap) != "undefined"){
        if(typeof (await eventsDetailResponse.data.seatmap.staticUrl) != "undefined"){
            eventPicture.src = await eventsDetailResponse.data.seatmap.staticUrl;
            eventPictureContainer.classList.remove("none");
        }
    }

    
    if(typeof (await eventsDetailResponse.data._embedded) != "undefined"){
        if(typeof (await eventsDetailResponse.data._embedded.venues) != "undefined"){
            showVenueDetail.innerHTML = `
            <div id="showVenueDetailsText">Show Venue Details</div>
            <div id="showVenueDetailsArrow">
                <div id="arrowBackground"></div>
            </div>
        
            <br />
            `;
            const showVenueDetailArrow = document.getElementById("showVenueDetailsArrow");
            const getVenueDetailsBind = getVenueDetails.bind(null, eventsDetailResponse.data._embedded.venues[0].name);
            showVenueDetailArrow.addEventListener("click", getVenueDetailsBind);           
        } else {
            showVenueDetailArrow.addEventListener("click", makeShowVenueDetailInvisible);
        } 
    } else {
        showVenueDetailArrow.addEventListener("click", makeShowVenueDetailInvisible);
    }

    makeShowVenueDetailVisible();
    makeEventCardVisible();
    eventCard.scrollIntoView();
    makeVenueCardInVisible();
}

async function getVenueDetails(keyword){
    if(typeof keyword == "undefined"){
        makeVenueCardInVisible();
        return;
    }
    
    console.log(keyword);
    const params = {
        apikey: "fFWL1pAuuxApZPwgMkxGHr6CEnUPLz7o",
        keyword: keyword,
    };
    const venueDetailResponse = await axios.get(venueDetailApi, {params: params});
    console.log(venueDetailResponse.data);

    if(typeof (await venueDetailResponse.data._embedded) == "undefined" || typeof (await venueDetailResponse.data._embedded.venues) == "undefined"){
        makeVenueCardInVisible();
        return;
    }

    const venueDetailContent = await venueDetailResponse.data._embedded.venues[0];
    let nameOfVenue = "";
    let streetAddress = "";
    let cityName = "";
    let stateName = "";
    let zipCode = "";

    const venueCardHeaderDiv = document.getElementById("venueCardHeader");
    venueCardHeaderDiv.classList.add("none");
    const venueCardHeaderText = document.getElementById("venueCardHeaderText");
    venueCardHeaderText.textContent = "";
    if(typeof (await venueDetailContent.name) != "undefined"){
        venueCardHeaderText.textContent = await venueDetailContent.name;
        nameOfVenue = encodeURIComponent(await venueDetailContent.name);
        if(venueCardHeaderText.textContent != ""){
            venueCardHeaderDiv.classList.remove("none");
        }
    }

    const venueCardIconDiv = document.getElementById("venueCardIconDiv");
    venueCardIconDiv.classList.add("none");
    const venueCardIcon = document.getElementById("venueCardIcon");
    if(typeof (await venueDetailContent.images) != "undefined"){
        if(typeof(venueDetailContent.images[0].url) != "undefined"){
            venueCardIcon.src = venueDetailContent.images[0].url;
            venueCardIconDiv.classList.remove("none");
        }
    }

    const address1Div = document.getElementById("address1Div");
    address1Div.classList.add("none");
    const address1 = document.getElementById("address1");
    address1.textContent = "";
    if(typeof (await venueDetailContent.address) != "undefined"){
        if(typeof (await venueDetailContent.address.line1) != "undefined"){
            address1.textContent = await venueDetailContent.address.line1;
            streetAddress = encodeURIComponent(await venueDetailContent.address.line1);
            if(address1.textContent != ""){
                address1Div.classList.remove("none");
            }
        }
    }


    const address2Div = document.getElementById("address2Div");
    address2Div.classList.add("none");
    const address2 = document.getElementById("address2");
    address2.textContent = "";
    if((typeof (await venueDetailContent.city) != "undefined" && typeof (await venueDetailContent.city.name) != "undefined") 
    || (typeof (await venueDetailContent.state) != "undefined" && typeof (await venueDetailContent.state.stateCode) != "undefined")){
        
        if(typeof (await venueDetailContent.city.name) != "undefined" && typeof (await venueDetailContent.state.stateCode) != "undefined"){
            address2.textContent = await venueDetailContent.city.name;
            address2.textContent += ", ";
            address2.textContent += await venueDetailContent.state.stateCode;
            cityName = encodeURIComponent(await venueDetailContent.city.name);
            stateName = encodeURIComponent(await venueDetailContent.state.stateCode);
        }

        if(typeof (await venueDetailContent.city.name) != "undefined" && typeof (await venueDetailContent.state.stateCode) == "undefined"){
            address2.textContent = await venueDetailContent.city.name;
            cityName = encodeURIComponent(await venueDetailContent.city.name);
        }

        if(typeof (await venueDetailContent.city.name) == "undefined" && typeof (await venueDetailContent.state.stateCode) != "undefined"){
            address2.textContent = await venueDetailContent.state.stateCode;
            stateName = encodeURIComponent(await venueDetailContent.state.stateCode);
        }
        

        if(address2.textContent != ""){
            address2Div.classList.remove("none");
        }
    }


    const address3Div = document.getElementById("address3Div");
    address3Div.classList.add("none");
    const address3 = document.getElementById("address3");
    address3.textContent = "";
    if(typeof (await venueDetailContent.postalCode) != "undefined"){
        address3.textContent = await venueDetailContent.postalCode;
        zipCode = encodeURIComponent(await venueDetailContent.postalCode);
        if(address3.textContent != ""){
            address3Div.classList.remove("none");
        }
    }

    const addressHeaderDiv = document.getElementById("addressHeaderDiv");
    if(address1.textContent == "" && address2.textContent == "" && address3.textContent == ""){
        addressHeaderDiv.classList.add("none")
    } else {
        addressHeaderDiv.classList.remove("none");
    }


    const googleMapLinkDiv = document.getElementById("googleMapLinkDiv");
    googleMapLinkDiv.classList.add("none");
    if(nameOfVenue != "" || streetAddress != "" || cityName != "" || stateName != "" || zipCode != ""){
        let arr = [nameOfVenue, streetAddress, cityName, stateName, zipCode];
        let parameters = "";
        for(let i = 0; i < 5; i++){
            if(arr[i] === ""){
                continue;
            }
            if(parameters !== ""){
                parameters += encodeURIComponent(", ");
            }
            parameters += arr[i];
        }
        console.log(parameters);

        let googleMapURL = "https://www.google.com/maps/search/?api=1&query=";
        googleMapURL += parameters;

        const googleMapLink = document.getElementById("googleMapLink")
        googleMapLink.href = googleMapURL;
        googleMapLinkDiv.classList.remove("none");
    }

    const moreVenueEventsLinkDiv = document.getElementById("moreVenueEventsLinkDiv");
    moreVenueEventsLinkDiv.classList.add("none");
    const moreVenueEventsLink = document.getElementById("moreVenueEventsLink");
    if(typeof (await venueDetailContent.url) != "undefined"){
        moreVenueEventsLink.href = await venueDetailContent.url;
        moreVenueEventsLinkDiv.classList.remove("none");
    }

    makeShowVenueDetailInvisible();
    makeVenueCardVisible();
    venueCard.scrollIntoView()
}
clearButton.addEventListener("click", clearButtonHandler);
searchButton.addEventListener("click", searchButtonHandler);
autoDetectCheckbox.addEventListener("change", autoDetectCheckboxHandler);
eventHeader.addEventListener("click", eventColumnSort);
genreHeader.addEventListener("click", genreColumnSort);
venueHeader.addEventListener("click", venueColumnSort);

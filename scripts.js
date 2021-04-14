// JS scripts
$(document).ready(function () {
    // -------------Quotes Sections-------------
    // loading icon for quotes carousel
    const whileLoading = (on, id) => {
        if (on) {
            $(`${id}`).append(`
                <div class="loaderContainer d-flex align-items center">  
                    <div id="loading" class="d-flex spinner-border justify-content-center" role="status">
                        <span class="sr-only">Loading...</span>
                    </div>
                </div>
            `);
        } else {
            $(".loaderContainer").remove();
        }
    }
    // Creates each carousel item of quotes in the project
    const getQuotes = () => {
        $.ajax({
            type: "GET",
            url: "https://smileschool-api.hbtn.info/quotes",
            beforeSend: () => whileLoading(1, "#carouselQuote"),
            success: function (res) {
                for (let i in res) {
                    $("#carouselInnerQuotes").append(`
                        <div class="carousel-item py-5 p-md-5">
                                <div class="item-inner d-md-flex flex-row">
                                    <img src="${res[i].pic_url}" width="160px" height="160px" class="d-block mx-auto rounded-circle mr-2" alt="Author of the quote 2">
                                    <div class="carousel-caption d-md-block text-left">
                                        <p>${res[i].text}</p>
                                        <p class="font-weight-bold">${res[i].name}</p>
                                        <p class="font-italic">${res[i].title}</p>
                                    </div>
                                </div>
                        </div> 
                    `);
                    if (i == 0) $("#carouselInnerQuotes .carousel-item").first().addClass("active");
                    whileLoading();
                }
            }
        })
    }


    // ------------- Video Carousel Sections -------------
    // Creates each slide with multiple carousel-items
    const cardSlider = (id) => {
        $(`#${id}`).carousel({
            interval: 10000
        })
        $(`.carousel #${id}-itemTutorial`).each(function () {
            let next = $(this).next();
            if (!next.length) next = $(this).siblings().first();
            next.children(':first-child').clone().appendTo($(this));

            for (let i = 0; i < 2; i++) {
                next = next.next();
                if (!next.length) next = $(this).siblings().first();
                next.children(':first-child').clone().appendTo($(this));
            }
        });

    };
    // Creates a carousel item for each tutorial card
    const makeTutorialCard = (URL, id) => {
        $.ajax({
            type: "GET",
            url: URL,
            beforeSend: () => whileLoading(1, id),
            success: function (res) {
                for (let i of res) {
                    $(`#${id}`).append(`
                        <div id="${id}-itemTutorial" class="carousel-item justify-content-center ${id}-card-${i.id}">
                            <div class="card border-0 mr-4">
                                <img src="${i.thumb_url}" class="card-img-top d-block img-fluid" alt="${i.keywords[0]} ${i.keywords[1]}" width="255px" height="154px">
                                <img src="./images/play.png" class="position-absolute play-icon" width="64px" height="64px">
                                <div class="card-body">
                                    <div>
                                        <h6 class="font-weight-bold">${i.title}</h6>
                                        <p class="card-text text-gray">${i["sub-title"]}</p>
                                        <span class="d-flex flex-row">
                                            <img src="${i.author_pic_url}" class="rounded-circle" alt="${i.keywords[0]} ${i.keywords[1]}" width="30px" height="30px">
                                            <p class="profile-video font-weight-bold ml-3">${i.author}</p>
                                        </span>
                                    </div>
                                    <span class="d-flex flex-row justify-content-between">
                                        <span id="${id}-stars">
                                        </span>
                                        <p class="profile-video p-0 m-0">${i.duration}</p>
                                    </span>
                                </div>  
                            </div>
                        </div> 
                    `);
                    for (let j = 0; j < i.star; j++)
                        $(`.${id}-card-${i.id} #${id}-stars`).append(`<img src="./images/star_on.png" alt="one full star" width="15px"></img>`);
                }
                $(`#${id}-itemTutorial`).first().addClass("active");
                cardSlider(id);
                whileLoading();
            }
        })
    }

    // ------------- Courses Filter -------------
    // Displays course cards based on filters(parameters)
    const getCourses = (keyword, topic, sortBy) => {
        let sortByObj = {
            "most popular": "most_popular",
            "most recent": "most_recent",
            "most viewed": "most_viewed"
        }

        let k = keyword.charAt(0).toUpperCase() + keyword.slice(1)
        $.ajax({
            type: "GET",
            url: `https://smileschool-api.hbtn.info/courses?q=${keyword}&topic=${topic}&sort=${sortByObj[sortBy]}`,
            beforeSend: whileLoading(1, "#section-results"),
            success: function (res) {
                $("#courses").empty();
                let numVids = 0
                for (let i of res.courses) {
                    $("#courses").append(`
                            <div id="course" class="card border-0 mr-4">
                                <img src="${i.thumb_url}" class="card-img-top d-block img-fluid" alt="${i.keywords[0]} ${i.keywords[1]}" width="255px" height="154px">
                                <img src="./images/play.png" class="position-absolute play-icon2" width="64px" height="64px">
                                <div class="card-body">
                                    <div>
                                        <h6 class="font-weight-bold">${i.title}</h6>
                                        <p class="card-text text-gray">${i["sub-title"]}</p>
                                        <span class="d-flex flex-row">
                                            <img src="${i.author_pic_url}" class="rounded-circle" alt="${i.keywords[0]} ${i.keywords[1]}" width="30px" height="30px">
                                            <p class="profile-video font-weight-bold ml-3">${i.author}</p>
                                        </span>
                                    </div>
                                    <span class="d-flex flex-row justify-content-between">
                                        <span id="${i.id}-stars">
                                        </span>
                                        <p class="profile-video p-0 m-0">${i.duration}</p>
                                    </span>
                                </div>  
                            </div>
                        `);
                    numVids++;
                }
                $("#courses").prepend(`
                    <p class="num-vid col-12">${numVids} videos</p>
                `);
            }
        });
    }

    // Listens for input/changes in filters
    const filterListener = () => {
        getCourses($("#keywords").val(), $("#btn-topic").text(), $("#btn-sort").text());
        $("#keywords").on("input", () => {
            getCourses($("#keywords").val(), $("#btn-topic").text(), $("#btn-sort").text());
        });
        $("#sortTopic .dropdown-item").click((e) => {
            $("#btn-topic").html($(e.target).text());
            getCourses($("#keywords").val(), $(e.target).text(), $("#btn-sort").text());
        });
        $("#sortBy .dropdown-item").click((e) => {
            $("#btn-sort").html($(e.target).text());
            getCourses($("#keywords").val(), $("#btn-topic").text(), $(e.target).text());
        });
    };

    // Displays dynamic section of filters
    const getFilters = () => {
        $.ajax({
            type: "GET",
            url: "https://smileschool-api.hbtn.info/courses",
            success: function (res) {
                $(".section-filter #filters").append(`
                        <div class="col-sm-12 col-md-12 col-lg-4">
                            <p class="text-uppercase m-0 font-weight-bold input-title">keywords</p>
                            <div class="input-group mb-3">
                                <div class="input-group-prepend bg-span">
                                    <span class="font-icon-filter input-group-text bg-transparent border-0 border-bottom bg-span text-white" id="basic-addon1"></span>
                                </div>
                                <input id="keywords" type="text" class="form-control border-0 border-bottom rounded-0" placeholder="Search by keyword" aria-label="keywords" aria-describedby="basic-addon1">
                            </div> 
                        </div> 
                        <div class="col-sm">
                            <p class="text-uppercase m-0 font-weight-bold input-title">Topic</p>
                            <div class="input-group mb-3">
                                <div class="input-group-prepend bg-span w-100">
                                    <button id="btn-topic" class="btn dropdown-toggle bg-span text-white border-0 w-100 d-flex justify-content-between align-items-center border-bottom toCap" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">${res.topic}</button>
                                    <div id="sortTopic" class="dropdown-menu w-100">
                                    </div>
                                </div>
                            </div> 
                        </div>
                        <div class="col-sm">
                            <p class="text-uppercase m-0 font-weight-bold input-title">Sort by</p>
                            <div class="input-group mb-3">
                                <div class="input-group-prepend bg-span w-100">
                                    <button id="btn-sort" class="btn dropdown-toggle text-white w-100 bg-span border-0 d-flex justify-content-between align-items-center border-bottom toCap" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">${res.sort.replace("_", " ")}</button>
                                    <div id="sortBy" class="dropdown-menu w-100">
                                    </div>
                                </div>
                            </div> 
                        </div>
                    `)
                for (let j of res.topics) {
                    $("#sortTopic").append(`
                            <a id="topicFilter" class="dropdown-item toCap" href="#">${j}</a>
                        `)
                }
                for (let j of res.sorts) {
                    let word = j.replace("_", " ");
                    $("#sortBy").append(`
                            <a id="${j}" class="dropdown-item toCap" href="#">${word}</a>
                        `)
                }
                $(".toCap").css("text-transform", "capitalize");
                filterListener();
            }
        })
    }


    // Calling all the functions
    getQuotes();
    makeTutorialCard("https://smileschool-api.hbtn.info/popular-tutorials", "innerVideos");
    makeTutorialCard("https://smileschool-api.hbtn.info/latest-videos", "latestInner");
    getFilters();
});
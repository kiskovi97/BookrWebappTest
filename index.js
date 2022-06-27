
var spinnerLoaderForMenu = document.getElementById("theSpinnerLoaderForMenu");
var spinnerLoader = document.getElementById("theSpinnerLoader");
let bookListHtmlItem = document.getElementById("book-list");
let videoPlayerBoyHtml = document.getElementById("video_player_box");
var myVideoHtml = document.getElementById("my-video");
var isCurrentBookFree = true;
var src = "";
var started = new Date();

function myStartHandler(e) {
    console.log("play event was called");
    started = new Date();
    if (!isCurrentBookFree) {
        console.log("Book is not free!");
        myVideoHtml.pause();
        alert("This book is not free!");
        var href = window.location.href;
        window.location.href = href.split('?')[0];
    }
}
function myEndHandler(e) {
    var ended = new Date();
    var distance = (ended.getTime() - started.getTime()) / 1000;
    const params = new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop) => searchParams.get(prop),
    });
    var result = {
        bookId: params.book,
        userId: null,
        startedAt: started,
        duration: distance,
        pagesVisited: [],
        lastPageVisited: 0,
    };
    var resultJson = JSON.stringify(result)
    console.log(resultJson)
    window.top.postMessage(resultJson, '*');
}

function LoadingMenu(isLoading)
{
    spinnerLoaderForMenu.style.display = isLoading ?  "block" : "none";
    return 
}

function Loading(isLoading)
{
    spinnerLoader.style.display = isLoading ?  "block" : "none";
    return 
}

function BookDataRecived(jsonData)
{
    isCurrentBookFree = false;
    console.log("books data arrived");
    LoadingMenu(false);
    const params = new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop) => searchParams.get(prop),
    });
    //var src = "";
    var posterImg = "https://api.v2.bookrclass.com/api/media/Ym9vay1jb3Zlci93LzMvdzNsa3p5ZzFZYW1pQjlxVXJMYU1vSFZseDU1UXJUeGhVT1VvbkVQWUs0LmpwZw==/original_4k.jpg";

    for (var id in jsonData.result.list) {
        var book = jsonData.result.list[id];

        const li = document.createElement('li');
        li.innerHTML = `<h3><a href="?book=`+book.id+`">`+book.title+`</a></h3>`;
        if (bookListHtmlItem) bookListHtmlItem.appendChild(li);

        if (book.id == params.book) {
            if (book.previewUrls)
            {
                src = book.previewUrls.original;
            } else {
                alert("This video is unavailable on mobile");
            }
            
            posterImg = book.coverUrls.optimal;
            isCurrentBookFree = book.isFree;
            console.log("isCurrentBookFree : " + isCurrentBookFree);
        }
    }
    
    if (params.book){
        videoPlayerBoyHtml.hidden = false;
        bookListHtmlItem.remove();
    } else {
        bookListHtmlItem.hidden = false;
        videoPlayerBoyHtml.remove();
    }

    var myVideoSrc = document.getElementById("videosrc");
    if (myVideoSrc) myVideoSrc.src = src;
    if (myVideoHtml) {
        console.log("myVideoHtml is loading");
        myVideoHtml.addEventListener('ended',myEndHandler);
        myVideoHtml.addEventListener('pause',myEndHandler);
        myVideoHtml.addEventListener('play',myStartHandler);
        /*myVideoHtml.addEventListener("click", function(event) { 
            console.log("isPlaying" + myVideoHtml.paused );
            console.log("onClick");
            if (myVideoHtml.paused == true) {
                myVideoHtml.play();
            }
            else {
                myVideoHtml.pause();
            }
        });*/
        myVideoHtml.setAttribute("poster",posterImg);
        myVideoHtml.load();
        console.log("myVideoHtml is loaded");
    }
}

function LoadMobile()
{
    LoadingMenu(true);
    //fetch("./StreamingAssets/books/booklist.json")
    //fetch("https://bookrlab.com/webvideo/booksList.php")
    fetch("https://api.v2.bookrclass.com/api/mobile/books")
    .then(response => {
        return response.json();
    })
    .then(jsonData =>  {		  
        // Turn off the menu booksList waiting spinner
        BookDataRecived(jsonData);
    });

    bookListHtmlItem.hidden = true;
    videoPlayerBoyHtml.hidden = true;
    myVideoHtml.pause();
    /* Custom Progressbar - Don't delete it, maybe it can be useful later again - Client asked for it, then changed his mind!
    document.getElementById("my-video").addEventListener("timeupdate", function() {
    // if the video is loaded and duration is known
    if(!isNaN(this.duration)) {
            var percent_complete = Math.round((this.currentTime / this.duration) * 100);
            // use percent_complete to draw a progress bar
            document.getElementById("progress").value = percent_complete;
        }
    });
    */
}

	  

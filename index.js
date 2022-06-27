
var spinnerLoaderForMenu = document.getElementById("theSpinnerLoaderForMenu");
var spinnerLoader = document.getElementById("theSpinnerLoader");
let bookListHtmlItem = document.getElementById("book-list");
let videoPlayerBoyHtml = document.getElementById("video_player_box");
var isCurrentBookFree = true;
var src = "";
var started = new Date();

function myStartHandler(e) {
    Loading(false);
    started = new Date();
    if (!isCurrentBookFree) {
        console.log("Book is not free!");
        document.getElementById("my-video").pause();
        alert("This book is not free!");
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
    
function playVideo() {		
  if (src && src != "") {
    Loading(false);
    console.log("in playVideo() function isCurrentBookFree : " + isCurrentBookFree);
    if (isCurrentBookFree) {
      document.getElementById("my-video").play();
    } else {
      alert("This book is not free!");
      console.log("This book is not free!");
    }				
  } else {
    console.log("src is still null");
    Loading(true);
  }
}

function playPause(btn,vid){
  var vid = document.getElementById(vid);
  if(vid.paused){
    vid.play();
    /*btn.innerHTML = "Pause";				*/
    btn.remove();
  } /*else {
    vid.pause();
    btn.innerHTML = "Play";
  }*/
}

function BookDataRecived(jsonData)
{
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
            src = book.previewUrls.original;
            posterImg = book.coverUrls.optimal;
            isCurrentBookFree = book.isFree;
            console.log("isCurrentBookFree : " + isCurrentBookFree);
        }
    }
    var myVideoSrc = document.getElementById("videosrc");
    if (myVideoSrc) myVideoSrc.src = src;
    var myVideo = document.getElementById("my-video");
    if (myVideo) {
        myVideo.load();
        myVideo.addEventListener('ended',myEndHandler,false);
        myVideo.addEventListener('pause',myEndHandler,false);
        myVideo.addEventListener('play',myStartHandler,false);
        myVideo.setAttribute("poster",posterImg);
    }
    
    if (params.book){
        videoPlayerBoyHtml.hidden = false;
        bookListHtmlItem.remove();
    } else {
        bookListHtmlItem.hidden = false;
        videoPlayerBoyHtml.remove();
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

	  

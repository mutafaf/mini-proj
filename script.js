var currPage = 1;

function nextPage() {
  if(currPage<getTotalPages()) {
    currPage++;
    populateImages();
  }
}

function prevPage() {
  if(currPage>1) {
    currPage--;
    populateImages();
  }
}
function getDate() {
  var date = new Date();
  var month = date.getUTCMonth();
  var day = date.getUTCDate();
  var year = date.getUTCFullYear();
  var monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  newdate = monthNames[month] + " "+ day + ", "+  year;
  return newdate;
}
function getLocalStorageImgs() {
  arr = JSON.parse(localStorage.getItem("imgs"))
  return arr ? arr : [];
}
function getTotalImagesCount(){
  return getLocalStorageImgs().length
}
function getTotalPages() {
  return Math.ceil(getTotalImagesCount()/4);
}

function showPages() {
  document.getElementById('showPages').innerHTML="Showing page "+currPage+" of "+ getTotalPages() +" pages"
}

function paginatedImgs(){

}

function deleteImg(index) {
  arr = getLocalStorageImgs()
  if (index>-1) {
    arr.splice(index,1)
  }
  localStorage.setItem("imgs", JSON.stringify(arr));
  populateImages();
}
function showNext(i) {
  arr = getLocalStorageImgs()
  if(i>=arr.length) {
    i=0;
  }
  console.log("Show next: "+arr[i].date);
  writeImg(arr[i].data,i,arr[i].time);
}
function showPrev(i) {
  arr = getLocalStorageImgs()
  if (i<0) {
    i= arr.length-1;
  }
  console.log("Show prev: "+arr[i].time);
  writeImg(arr[i].data,i,arr[i].time);
}
function writeImg(data,i,date) {
  document.getElementById('zoomview').innerHTML="";

  div = document.createElement('div')
  prev = i - 1;
  next = i + 1;
  div.style.width="100%";
  div.innerHTML=[
    '<i class="fas fa-chevron-left zoom" onclick="showPrev(',
    prev,
    ')"></i>',
    '<span onclick="closeGal()">',
    '<i class="fas fa-trash tbin" onclick="deleteImg(',
    i,
    ')"></i>',
    '<img class="galimg" src="',
    data,
    '"/>',
    '<div class="date">',
    date,
    '</div>',
    '</span><i class="fas fa-chevron-right zoom" onclick="showNext(',
    next,
    ')"></i>',
    ].join('');

    document.getElementById('zoomview').insertBefore(div, null);
}
function showGal(data, i, date){
  console.log(date);
  document.getElementById('zoomview').style.display="flex";
  document.getElementsByTagName('body')[0].style.overflow="hidden";

  writeImg(data,i,date)
}
function populateImages() {
  arr = getLocalStorageImgs();
  document.getElementById('list').innerHTML=""

  start = (currPage-1)*4
  end = (currPage)*4
  for (var i = start; i < end && i < arr.length; i++) {
    var span = document.createElement('span');
    span.innerHTML = ['<img class="thumbnail" src="', arr[i].data,'" onclick="showGal(\'', arr[i].data, '\',',i,',\'' ,arr[i].time,'\'',')" />'].join('');
    document.getElementById('list').insertBefore(span, null);
  }
  showPages()
}
function handleFileSelect(evt) {
  var files = evt.target.files;

    f = files[0];

    // Only process image files.
    if (!f.type.match('image.*')) {
      return;
    }

    var reader = new FileReader();

    // Closure to capture the file information.

    reader.onload = (function(theFile) {
      return function(e) {
        // imgs.push(img)
        arr = getLocalStorageImgs();

        arr.push({data: e.target.result, time: getDate()})
        try {
          localStorage.setItem("imgs", JSON.stringify(arr));
        }
        catch(e) {
          alert('Error: Your browser localStorage limit exceeded!!\nClear your localStorage or Delete few images and try again. Thanks');
        }

        populateImages();
      };
    })(f);

    reader.readAsDataURL(f);
  // }
}
function bodyLoaded() {
  populateImages();
}
function closeGal(){
  document.getElementById('zoomview').style.display="none";
  document.getElementsByTagName('body')[0].style.overflow="auto";
}
document.getElementById('files').addEventListener('change', handleFileSelect, false);

const videoGrid = document.getElementById('video-grid')

function addVideo(labelMiniVidId, username, stream) {
  const video = document.createElement('video')
  const miniVid = document.createElement('div')
  const labelMiniVid = document.createElement('div')

  video.className = 'vid'
  video.srcObject = stream
  video.addEventListener('loadedmetadata', () => {
    video.play()
  })

  labelMiniVid.id = labelMiniVidId
  labelMiniVid.className = 'label-mini-vid'
  labelMiniVid.innerHTML = username  

  miniVid.className ='mini-vid'
  miniVid.append(video)
  miniVid.append(labelMiniVid)
  videoGrid.append(miniVid)
}

async function getMedia() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true
    })
    let myVideoStream = stream
    addVideo('my-label-mini-vid', USERNAME, myVideoStream)
  } catch (err) { 
    console.log(err)
  }
}

getMedia()
let audioPlayer = document.getElementById('audioPlayer');
let playPauseBtn = document.getElementById('playPauseBtn');
let prevBtn = document.getElementById('prevBtn');
let nextBtn = document.getElementById('nextBtn');
let playlist = document.getElementById('playlist').getElementsByTagName('li');
let progressBar = document.getElementById('progress');
let progressBarContainer = document.getElementById('progressBar');
let songTitle = document.getElementById('songTitle');
let currentTimeElem = document.getElementById('currentTime');
let totalTimeElem = document.getElementById('totalTime');

let currentSong = 0;

// Fungsi untuk memuat lagu dan update judul serta progress bar
function loadSong(songIndex) {
    let song = playlist[songIndex];
    audioPlayer.src = song.getAttribute('data-src');
    songTitle.textContent = song.getAttribute('data-title'); // Update judul lagu
    audioPlayer.play();
    updatePlayPauseIcon(true);  // Ganti ikon play ke pause
    updateActiveSong(songIndex);
}

function updateActiveSong(songIndex) {
    Array.from(playlist).forEach(song => song.classList.remove('active'));
    playlist[songIndex].classList.add('active');
}

// Update ikon play/pause
function updatePlayPauseIcon(isPlaying) {
    const icon = playPauseBtn.querySelector('ion-icon');
    icon.setAttribute('name', isPlaying ? 'pause-outline' : 'play-outline');
}

// Format durasi ke dalam format MM:SS
function formatTime(seconds) {
    let minutes = Math.floor(seconds / 60);
    let secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
}

// Update progress bar dan waktu berjalan
audioPlayer.addEventListener('timeupdate', () => {
    let progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
    progressBar.style.width = `${progress}%`;
    
    // Update waktu berjalan
    currentTimeElem.textContent = formatTime(audioPlayer.currentTime);
    
    // Update durasi total setelah lagu di-load
    if (!isNaN(audioPlayer.duration)) {
        totalTimeElem.textContent = formatTime(audioPlayer.duration);
    }
});

// Fungsi play/pause
playPauseBtn.addEventListener('click', () => {
    if (audioPlayer.paused) {
        audioPlayer.play();
        updatePlayPauseIcon(true);  // Ganti ikon ke pause saat diputar
    } else {
        audioPlayer.pause();
        updatePlayPauseIcon(false); // Ganti ikon ke play saat dijeda
    }
});

// Tombol kembali
prevBtn.addEventListener('click', () => {
    currentSong = (currentSong === 0) ? playlist.length - 1 : currentSong - 1;
    loadSong(currentSong);
});

// Tombol next
nextBtn.addEventListener('click', () => {
    currentSong = (currentSong === playlist.length - 1) ? 0 : currentSong + 1;
    loadSong(currentSong);
});

// Klik progress bar untuk mengubah posisi lagu
progressBarContainer.addEventListener('click', (e) => {
    let width = progressBarContainer.clientWidth;
    let clickX = e.offsetX;
    let duration = audioPlayer.duration;
    
    audioPlayer.currentTime = (clickX / width) * duration;
});

// Pilih lagu dari playlist
Array.from(playlist).forEach((song, index) => {
    song.addEventListener('click', () => {
        currentSong = index;
        loadSong(currentSong);
    });
});

// Event saat lagu selesai (lanjut ke lagu berikutnya)
audioPlayer.addEventListener('ended', () => {
    currentSong = (currentSong === playlist.length - 1) ? 0 : currentSong + 1;
    loadSong(currentSong);
});

// Muat lagu pertama kali
loadSong(currentSong);
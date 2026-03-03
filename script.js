let searchBtn = document.querySelector('#search-btn');
let searchBar = document.querySelector('.search-bar-container');
let profileBtn = document.querySelector('#profile-btn');
let profilePopup = document.querySelector('#profile-popup');
let menu = document.querySelector('#menu-bar')
let navbar = document.querySelector('.navbar')
let videoBtn = document.querySelectorAll('.vid-btn')
let videoSlider = document.querySelector('#video-slider')
let videoIntervalId;
window.onscroll = () =>{
    searchBtn.classList.remove('fa-times');
    searchBar.classList.remove('active');
    profilePopup?.classList.remove('active');
    menu.classList.remove('fa-times');
    navbar.classList.remove('active');
}

menu.addEventListener('click', () =>{
    menu.classList.toggle('fa-times');
    navbar.classList.toggle('active');
});

searchBtn.addEventListener('click', () =>{
    searchBtn.classList.toggle('fa-times');
    searchBar.classList.toggle('active');
    profilePopup?.classList.remove('active');
});

profileBtn?.addEventListener('click', () =>{
    profilePopup?.classList.toggle('active');
    searchBtn.classList.remove('fa-times');
    searchBar.classList.remove('active');
});

document.addEventListener('click', (event) => {
    if (!profilePopup || !profileBtn) return;
    if (!profilePopup.contains(event.target) && !profileBtn.contains(event.target)) {
        profilePopup.classList.remove('active');
    }
});

function setActiveVideo(index) {
    if (!videoBtn.length || !videoSlider) return;
    const safeIndex = (index + videoBtn.length) % videoBtn.length;
    const currentActive = document.querySelector('.controls .active');
    currentActive?.classList.remove('active');
    videoBtn[safeIndex].classList.add('active');
    videoSlider.src = videoBtn[safeIndex].getAttribute('data-src');
}

function startVideoCycle() {
    if (!videoBtn.length || !videoSlider) return;
    clearInterval(videoIntervalId);
    videoIntervalId = setInterval(() => {
        const currentIndex = Array.from(videoBtn).findIndex((btn) =>
            btn.classList.contains('active')
        );
        const nextIndex = currentIndex === -1 ? 0 : currentIndex + 1;
        setActiveVideo(nextIndex);
    }, 7000);
}

videoBtn.forEach((btn, index) => {
    btn.addEventListener('click', () => {
        setActiveVideo(index);
        startVideoCycle();
    });
});

startVideoCycle();
document.getElementById('contact-btn')?.addEventListener('click', function (e) {
  e.preventDefault(); // Prevents default form submission
  alert('Message Sent! Our team will contact you shortly.');
});

document.getElementById('form-book-btn')?.addEventListener('click', function (e) {
  e.preventDefault(); // Prevents default form submission
  alert('🚀 Tour booked! Our team will contact you shortly.');
});

var swiper = new Swiper(".review-slider", {
    spaceBetween: 20, 
    loop:true,
    autoplay: {
        delay: 2500,
        disableOnInteraction: false,
    },
    breakpoints: {
        640: {
            slidesPerView: 1,
        },
        768: {
            slidesPerView: 2,
        },
        1024: {
            slidesPerView: 3,
        },
    },

});

var swiper = new Swiper(".brand-slider", {
    spaceBetween: 200, 
    loop:true,
    autoplay: {
        delay: 2500,
        disableOnInteraction: false,
    },
    breakpoints: {
        450: {
          slidesPerView: 2,
        },
        768: {
          slidesPerView: 3,
        },
        991: {
          slidesPerView: 4,
        },
        1200: {
          slidesPerView: 5,
        },
    },

});



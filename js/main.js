const apiKey = 'e9b49d3e1cc7a3225b7760dcf18b6ba7';
const baseUrl = 'https://api.themoviedb.org/3';
const HomeAPIRoutes = {
    "Trending Movies": { url: "/trending/movie/week" },
    "Popular Movies": { url: "/movie/popular" },
    "Top Rated Movies": { url: "/movie/top_rated" },
    "Now Playing at Theatres": { url: "/movie/now_playing" },
    "Upcoming Movies": { url: "/movie/upcoming" },
};

// Hàm lấy thông tin phim Hero
async function fetchHeroMovie() {
    const trendingMoviesUrl = `${baseUrl}/trending/movie/week?api_key=${apiKey}`;

    try {
        const response = await fetch(trendingMoviesUrl);
        const data = await response.json();
        const movies = data.results;
        const randomMovie = movies[Math.floor(Math.random() * movies.length)];

        updateHeroSection(randomMovie);
    } catch (error) {
        console.error('Error fetching hero movie:', error);
    }
}

// Hàm cập nhật phần Hero với dữ liệu phim
function updateHeroSection(movie) {
    const heroImg = document.getElementById('hero-image');
    const heroTitle = document.querySelector('.hero-title');
    const heroDescription = document.querySelector('.hero-des');
    const watchNowBtn = document.getElementById('watch-now-btn');
    const viewInfoBtn = document.getElementById('view-info-btn');
    const imagePreview = document.getElementById('hero-preview');

    heroImg.src = `https://image.tmdb.org/t/p/original${movie.backdrop_path}`;
    heroTitle.textContent = movie.title;
    heroDescription.textContent = movie.overview;
    watchNowBtn.href = `html/watch.html?id=${movie.id}`;
    viewInfoBtn.href = `html/watch.html?id=${movie.id}`;
    imagePreview.src = `https://image.tmdb.org/t/p/original${movie.backdrop_path}`;
}

// Hàm gọi API và xử lý dữ liệu trả về cho các danh mục phim
async function fetchMovies(category) {
    const url = `${baseUrl}${HomeAPIRoutes[category].url}?api_key=${apiKey}&language=en-US&page=1`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        displayMovies(category, data.results);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

// Hàm hiển thị các phim theo danh mục
function displayMovies(category, movies) {
    const main = document.querySelector('main');

    const swiper = createSwiper(movies, category);
    main.appendChild(swiper);
}

// Hàm tạo Swiper cho một danh mục phim
function createSwiper(movies, category) {
    const swiper = document.createElement('div');
    swiper.classList.add('swiper', 'swiper-container');

    const categoryTitle = document.createElement('h2');
    categoryTitle.textContent = category;

    const swiperWrapper = document.createElement('div');
    swiperWrapper.classList.add('swiper-wrapper', 'movie-list');

    movies.forEach(movie => {
        const swiperSlide = createMovieSlide(movie);
        swiperWrapper.appendChild(swiperSlide);
    });

    const swiperButtonPrev = document.createElement('div');
    swiperButtonPrev.classList.add('swiper-button-prev');

    const swiperButtonNext = document.createElement('div');
    swiperButtonNext.classList.add('swiper-button-next');

    swiper.appendChild(categoryTitle);
    swiper.appendChild(swiperWrapper);
    swiper.appendChild(swiperButtonPrev);
    swiper.appendChild(swiperButtonNext);

    // Initialize Swiper
    new Swiper(swiper, {
        spaceBetween: 30,
        autoplay: { delay: 5000, disableOnInteraction: true },
        slidesPerView: "auto",
        loop: true,
        slidesPerGroupAuto: true,
        navigation: {
            nextEl: swiperButtonNext,
            prevEl: swiperButtonPrev,
        },
    });

    return swiper;
}

// Hàm tạo slide cho mỗi phim
function createMovieSlide(movie) {
    const swiperSlide = document.createElement('div');
    swiperSlide.classList.add('swiper-slide', 'movie-item');

    const movieLink = document.createElement('a');
    movieLink.href = `html/watch.html?id=${movie.id}`;
    movieLink.target = '_blank';
    movieLink.classList.add('movie-link');

    const movieImage = document.createElement('img');
    movieImage.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
    movieImage.alt = movie.title;
    movieImage.classList.add('movie-image');

    const movieTitle = document.createElement('p');
    movieTitle.textContent = movie.title;
    movieTitle.classList.add('movie-name');

    movieLink.appendChild(movieImage);
    movieLink.appendChild(movieTitle);
    swiperSlide.appendChild(movieLink);

    return swiperSlide;
}

// Gọi hàm fetchHeroMovie để cập nhật phần Hero
fetchHeroMovie();

// Gọi các API cho từng danh mục phim
for (const category in HomeAPIRoutes) {
    fetchMovies(category);
}

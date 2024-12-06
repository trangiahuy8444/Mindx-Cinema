const apiKey = "e9b49d3e1cc7a3225b7760dcf18b6ba7";
const baseUrl = "https://api.themoviedb.org/3";

// Hàm lấy thông tin chi tiết phim
async function fetchMovieDetails(movieId) {
    const url = `${baseUrl}/movie/${movieId}?api_key=${apiKey}`;
    const response = await fetch(url);
    return response.json();
}

// Hàm lấy danh sách phim tương tự
async function fetchSimilarMovies(movieId) {
    const url = `${baseUrl}/movie/${movieId}/similar?api_key=${apiKey}`;
    const response = await fetch(url);
    return response.json();
}

// Hàm cập nhật thông tin phim vào trang
async function updateMoviePage(movieId) {
    try {
        // Lấy thông tin phim chi tiết và phim tương tự
        const [movieData, similarMoviesData] = await Promise.all([
            fetchMovieDetails(movieId),
            fetchSimilarMovies(movieId)
        ]);

        // Kiểm tra dữ liệu trả về
        if (!movieData || !similarMoviesData) {
            alert("Không thể tải thông tin phim!");
            return;
        }

        // Cập nhật thông tin phim chính
        updateMovieInfo(movieData);

        // Cập nhật danh sách phim tương tự
        updateSimilarMovies(similarMoviesData);
    } catch (error) {
        console.error("Có lỗi xảy ra:", error);
        alert("Có lỗi xảy ra khi tải dữ liệu.");
    }
}

// Hàm cập nhật thông tin phim vào các phần tử trên trang
function updateMovieInfo(movieData) {
    document.querySelector("#movie-title").innerText = movieData.title || movieData.name;
    document.querySelector("#movie-description").innerText = movieData.overview;
    
    if (movieData.release_date) {
        document.querySelector("#release-date").innerText = `Release Date: ${movieData.release_date}`;
    }

    // Cập nhật iframe để phát video
    const iframe = document.querySelector("#movie-player");
    iframe.src = `https://www.2embed.cc/embed/${movieData.id}`;
}

// Hàm cập nhật danh sách phim tương tự
function updateSimilarMovies(similarMoviesData) {
    if (similarMoviesData.results && similarMoviesData.results.length > 0) {
        const similarMoviesHTML = similarMoviesData.results.map(item => {
            return /*html*/ `
                <a href="./watch.html?id=${item.id}">
                    <div class="similar-movie">
                        <img onload="this.style.opacity = '1'" alt="${item.title}" 
                             src="https://image.tmdb.org/t/p/w200${item.poster_path}" />
                        <p>${item.title}</p>
                    </div>
                </a>`;
        }).join("");
        document.querySelector("#similar-movies-list").innerHTML = similarMoviesHTML;
    } else {
        document.querySelector("#similar").innerHTML = "<p>No similar movies found.</p>";
    }
}

// Hàm xử lý sự kiện bình luận
function handleCommentSubmission() {
    const commentText = document.getElementById("comment-text").value;
    if (commentText.trim() !== "") {
        // Tạo phần bình luận mới
        const commentDiv = document.createElement("div");
        commentDiv.classList.add("comment");

        // Tạo phần tên tác giả
        const commentAuthor = document.createElement("p");
        commentAuthor.classList.add("comment-author");
        commentAuthor.innerText = "User"; // Tên có thể thay đổi thành người dùng thực tế

        // Tạo phần nội dung bình luận
        const commentContent = document.createElement("p");
        commentContent.classList.add("comment-text");
        commentContent.innerText = commentText;

        // Gắn các phần tử vào div comment
        commentDiv.appendChild(commentAuthor);
        commentDiv.appendChild(commentContent);

        // Thêm phần bình luận vào danh sách bình luận
        document.getElementById("comments").prepend(commentDiv);

        // Xóa nội dung trong ô text sau khi gửi
        document.getElementById("comment-text").value = "";
    } else {
        alert("Please enter a comment!");
    }
}

// Hàm kiểm tra và lấy ID phim từ URL
function getMovieIdFromURL() {
    const searchQuery = new URLSearchParams(location.search);
    return searchQuery.get("id");
}

// Hàm kiểm tra nếu không có movieId thì điều hướng về trang index
function redirectIfNoMovieId(movieId) {
    if (!movieId) {
        location.href = "./index.html";  // Nếu không có movieId, điều hướng về trang index.
    }
}

// Hàm khởi tạo trang phim
function initializeMoviePage() {
    const movieId = getMovieIdFromURL();
    redirectIfNoMovieId(movieId);
    updateMoviePage(movieId);
}

// Gọi hàm khởi tạo trang phim
initializeMoviePage();

// Xử lý bình luận
document.getElementById("submit-comment").addEventListener("click", handleCommentSubmission);

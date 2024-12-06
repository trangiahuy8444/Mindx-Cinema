const apiKey = "e9b49d3e1cc7a3225b7760dcf18b6ba7";
const baseUrl = "https://api.themoviedb.org/3";
const searchQuery = new URLSearchParams(location.search);

// Lấy từ khóa tìm kiếm từ URL
const query = searchQuery.get("q")?.trim();

(async () => {
  if (query) {
    try {
      // Gọi API tìm kiếm với từ khóa đã nhập
      const data = await (
        await fetch(
          `${baseUrl}/search/movie?query=${encodeURIComponent(query)}&api_key=${apiKey}`
        )
      ).json();

      // Kiểm tra nếu có kết quả trả về
      if (data.results.length > 0) {
        // Ẩn form tìm kiếm và hiển thị kết quả
        document.querySelector("form").style.display = "none";
        document.querySelector("#movie-grid").style.display = "grid";

        // Hiển thị kết quả tìm kiếm
        document.querySelector("#movie-grid").innerHTML = `
          <h1 class="text-2xl mb-8">Search result for '${query}'</h1>
          <div class="movie-grid">
            ${data.results
              .map(
                (item) => /*html*/ `
                <a href="./watch.html?id=${item.id}">
                  <div class="movie-card">
                    <img
                      style="width: auto; height: auto; aspect-ratio: 2/3"
                      class="fade-in"
                      onload="this.style.opacity = '1'"
                      src="https://image.tmdb.org/t/p/w200${item.poster_path}"
                      alt="${item.title || item.name}"
                    />
                    <p class="multiline-ellipsis-2">
                      ${item.title || item.name}
                    </p>
                  </div>
                </a>`
              )
              .join("")}
          </div>
        `;
      } else {
        // Nếu không có kết quả, hiển thị thông báo
        document.querySelector("#movie-grid").innerHTML = `
          <h1>No results found for '${query}'</h1>
        `;
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      // Hiển thị thông báo lỗi nếu có vấn đề với API
      document.querySelector("#movie-grid").innerHTML = `
        <h1>Error occurred. Please try again later.</h1>
      `;
    }
  }

  // Ẩn backdrop sau khi tìm kiếm
  document.querySelector(".backdrop").classList.add("backdrop-hidden");
})();

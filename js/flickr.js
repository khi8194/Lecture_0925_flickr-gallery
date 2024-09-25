const list = document.querySelector(".list");
const api_key = "21e294ad0ec03a32d7355980457d9e11";
const baseURL = `https://www.flickr.com/services/rest/?api_key=${api_key}&method=`;
const myID = "197119297@N02";
const method_mine = "flickr.people.getPhotos";
let url = `${baseURL}${method_mine}&user_id=${myID}&nojsoncallback=1&format=json`;
//기본요청URL에 쿼리값 제대로 넣어서 fetch처리했을때
//콘솔문에 not valid json 오류뜨는 경우
//원인 : json데이터가 callback함수안에 들어가 있는 경우
//해결방법 : format=json&nojsoncallback=1 (callback안쪽의 json데이터를 직접 가져옴)
fetch(url)
	.then((data) => data.json())
	.then((json) => {
		console.log(json.photos.photo);
		const picArr = json.photos.photo;
		let tags = "";

		picArr.forEach((pic) => {
			tags += `
        <li>
          <figure class='pic'>
            <img src="https://live.staticflickr.com/${pic.server}/${pic.id}_${pic.secret}_m.jpg" alt={pic.title}
          </figure>
          <h2>${pic.title}</h2>
          <div class='profile'>
            <img src='http://farm${pic.farm}.staticflickr.com/${pic.server}/buddyicons/${pic.owner}.jpg' alt=${pic.owner} /> <span>${pic.owner}</span>
          </div>
        </li>
      `;
		});

		list.innerHTML = tags;
	});

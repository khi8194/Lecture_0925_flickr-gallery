// let dataType = "";
let optString = "";
const [btnMine, btnPopular] = document.querySelectorAll("nav button");
// const [_, inputSearch, btnSearch] = document.querySelector(".searchBox").children;
const searchBox = document.querySelector(".searchBox");
const inputSearch = searchBox.querySelector("input");

fetchFlickr({ type: "mine" });
btnMine.addEventListener("click", () => fetchFlickr({ type: "mine" }));
btnPopular.addEventListener("click", () => fetchFlickr({ type: "interest" }));

// btnSearch.addEventListener("submit", () => {
//form요소에 직접 submit 이벤트 연결
searchBox.addEventListener("submit", e => {
	//해당 폼요소를 실제 서버로 전달할 것이 아니기에 e.preventDefault()로 form전송 기능을 막아줌
	e.preventDefault();
	if (!inputSearch.value) return;
	fetchFlickr({ type: "search", tags: inputSearch.value });
	inputSearch.value = "";
});

//특정 요소에 특정 함수 연결
document.body.addEventListener("click", e => {
	if (e.target.className === "thumb") createModal(e);
	if (e.target.className === "btnClose") removeModal();
	if (e.target.className === "userID") fetchFlickr({ type: "user", userID: e.target.innerText }); //user타입 갤러리에는 userID라는 추가 프로퍼티로 유저아이디값을 전달
});

//flickr fetching함수
function fetchFlickr(opt) {
	// //타입이 opt라는 파라미터 객체 안쪽에 들어가 있기 때문에 opt.type
	// if (opt.type === dataType) return;
	// dataType = opt.type;

	//참조링크 비교가 아닌 값 자체를 비교하기 위해서
	//opt객체를 강제로 문자화해서 stringifyOpt변수에 저장
	let stringifyOpt = JSON.stringify(opt);
	//문자화된 옵션객체 자체를 비교처리
	if (stringifyOpt === optString) return;
	//문자화된 옵션 객체를 전역변수는 optString에 저장해서 다음번 비교에 사용
	optString = stringifyOpt;

	const api_key = "21e294ad0ec03a32d7355980457d9e11";
	const baseURL = `https://www.flickr.com/services/rest/?api_key=${api_key}&method=`;
	const myID = "197119297@N02";
	const method_mine = "flickr.people.getPhotos";
	const method_interest = "flickr.interestingness.getList";
	//검색전용 api 메서드 추가
	const method_search = "flickr.photos.search";
	let url_mine = `${baseURL}${method_mine}&user_id=${myID}&nojsoncallback=1&format=json`;
	let url_user = `${baseURL}${method_mine}&user_id=${opt.userID}&nojsoncallback=1&format=json`;
	let url_interest = `${baseURL}${method_interest}&nojsoncallback=1&format=json`;
	//opt로 전달된 tags 프로퍼티의 값을 tags라는 쿼리값 연동
	let url_search = `${baseURL}${method_search}&tags=${opt.tags}&nojsoncallback=1&format=json`;

	let result_url = "";
	if (opt.type === "mine") result_url = url_mine;
	// else if (opt.type === "interest") result_url = url_interest;
	// else if (opt.type === "user") result_url = url_user;
	if (opt.type === "interest") result_url = url_interest;
	if (opt.type === "user") result_url = url_user;
	//전달된 opt.type값이 search이면 url_search 요청을 fetch함수에 전달
	if (opt.type === "search") result_url = url_search;

	fetch(result_url)
		.then(data => data.json())
		.then(json => {
			const picArr = json.photos.photo;
			createList(picArr);
		});
}

//목록 생성 함수
function createList(dataArr) {
	const list = document.querySelector(".list");
	let tags = "";

	dataArr.forEach(pic => {
		tags += `
        <li>
          <figure class='pic'>
            <img class='thumb' src="https://live.staticflickr.com/${pic.server}/${pic.id}_${pic.secret}_z.jpg" alt="https://live.staticflickr.com/${pic.server}/${pic.id}_${pic.secret}_b.jpg" />
          </figure>
          <h2>${pic.title}</h2>
          <div class='profile'>
            <img src='http://farm${pic.farm}.staticflickr.com/${pic.server}/buddyicons/${pic.owner}.jpg' alt=${pic.owner} /> <span class='userID'>${pic.owner}</span>
          </div>
        </li>
      `;
	});

	list.innerHTML = tags;

	setDefImg();
}

//이미지 엑박시 대체이미지 연결 함수
function setDefImg() {
	const profilePic = document.querySelectorAll(".profile img");
	console.log(profilePic);

	profilePic.forEach(imgEl => (imgEl.onerror = () => imgEl.setAttribute("src", "https://www.flickr.com/images/buddyicon.gif")));
}

//모달생성 함수
function createModal(e) {
	const imgSrc = e.target.getAttribute("alt");
	const modal = document.createElement("aside");
	modal.classList.add("modal");
	modal.innerHTML = `
    <div class='con'>
      <img src=${imgSrc} />
    </div>
    <button class='btnClose'>CLOSE</button>
  `;
	document.body.append(modal);
}

//모달 제거함수
function removeModal() {
	document.querySelector(".modal").remove();
}

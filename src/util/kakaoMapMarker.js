/* global kakao */
let globalOverlay = null;
let globalStoreOverlay = null;
// 마커 이미지 생성
export function markerImage() {
  let imageSize = new kakao.maps.Size(50, 50); // 마커이미지의 크기입니다
  let imageOption = { offset: new kakao.maps.Point(27, 39) }; // 마커이미지의 옵션입니다. 마커의 좌표와 일치시킬 이미지 안에서의 좌표를 설정합니다.

  return new kakao.maps.MarkerImage(
    require(process.env.VUE_APP_KAKAOMAP_ICON),
    imageSize,
    imageOption
  );
}

export function specialMarkerImage() {
  let imageSize = new kakao.maps.Size(50, 50); // 마커이미지의 크기입니다
  let imageOption = { offset: new kakao.maps.Point(27, 39) }; // 마커이미지의 옵션입니다. 마커의 좌표와 일치시킬 이미지 안에서의 좌표를 설정합니다.

  return new kakao.maps.MarkerImage(
    require(process.env.VUE_APP_KAKAOMAP_SPECIAL_ICON),
    imageSize,
    imageOption
  );
}

export function storeMarkerImage() {
  let imageSize = new kakao.maps.Size(50, 50); // 마커이미지의 크기입니다
  let imageOption = { offset: new kakao.maps.Point(27, 39) }; // 마커이미지의 옵션입니다. 마커의 좌표와 일치시킬 이미지 안에서의 좌표를 설정합니다.

  return new kakao.maps.MarkerImage(
    require(process.env.VUE_APP_KAKAOMAP_STORE_ICON),
    imageSize,
    imageOption
  );
}

export function storeMarkerInfoWindow(data, marker, map) {
  kakao.maps.event.addListener(marker, "click", function () {
    let customOverlay = makeStoreMarkerOverlay(map, marker, data);

    if (globalStoreOverlay) {
      globalStoreOverlay.setMap(null);
    }
    customOverlay.setMap(map);
    globalStoreOverlay = customOverlay;
  });
}

export function makeStoreMarkerOverlay(map, marker, data) {
  let customOverlay = new kakao.maps.CustomOverlay({
    // position: marker.getPosition(),
    position: new kakao.maps.LatLng(data.lat, data.lng),
    xAnchor: 0.5,
    yAnchor: 0.5,
  });

  var content = document.createElement("div");
  content.className = "store-overlay";

  var titleDiv = document.createElement("div");
  titleDiv.className = "custom-overlay-title";
  titleDiv.innerHTML = `<span>${data.name} ${data.branch_name}</span>`;

  var closeBtn = document.createElement("button");
  closeBtn.className = "custom-overlay-close-button";
  closeBtn.innerHTML = "X";

  // 닫기버튼을 누르면 글로벌 오버레이를 닫는다.
  // 한 번 오버레이 열었다면 글로벌 오버레이는, 현재 열린 오버레이다!
  closeBtn.onclick = function () {
    if (globalStoreOverlay) {
      globalStoreOverlay.setMap(null);
    }
  };

  var mainDiv = document.createElement("div");
  mainDiv.className = "store-overlay-main";
  mainDiv.innerHTML = `
    <div class="store-overlay-content">
      <p>${data.sub_category_name}</p>
      <p>${data.jibun_address}</p>
    </div>
  `;

  titleDiv.appendChild(closeBtn);
  content.appendChild(titleDiv);
  content.appendChild(mainDiv);
  customOverlay.setContent(content);
  return customOverlay;
}

// 마커 클릭시 오버레이 생성할 수 있도록 한다.
export function markerInfoWindow(data, marker, map, getAptDeals, closeOveray) {
  kakao.maps.event.addListener(marker, "click", function () {
    let customOverlay = makeMarkerOverlay(
      map,
      marker,
      data,
      getAptDeals,
      closeOveray
    );

    if (globalOverlay) {
      globalOverlay.setMap(null);
    }
    customOverlay.setMap(map);
    globalOverlay = customOverlay;
    getAptDeals(data.aptCode, data.aptName);
  });
}

function makeMarkerOverlay(map, marker, data, getAptDeals, closeOveray) {
  let customOverlay = new kakao.maps.CustomOverlay({
    // position: marker.getPosition(),
    position: new kakao.maps.LatLng(data.lat, data.lng),
    xAnchor: 0.5,
    yAnchor: 0.5,
    zIndex: 10,
  });

  // let content = `<div class="wrap">
  //       <div class="info">
  //           <div class="title">
  //            ${data.aptName}
  //              <div class="closeOverLayButton" title="닫기"></div>
  //          </div>
  //           <div class="body">
  //               <button>닫기</button>
  //              </div>
  //               <div class="desc">
  //                   aaaaaaaaaaaaaaaaaaaaaaaa
  //               </div>
  //           </div>
  //       </div>
  //   </div>`;

  var content = document.createElement("div");
  content.className = "custom-overlay";

  var titleDiv = document.createElement("div");
  titleDiv.className = "custom-overlay-title";
  titleDiv.innerHTML = `<span>${data.aptName}</span>`;

  var closeBtn = document.createElement("button");
  closeBtn.className = "custom-overlay-close-button";
  closeBtn.innerHTML = "X";

  // 닫기버튼을 누르면 글로벌 오버레이를 닫는다.
  // 한 번 오버레이 열었다면 글로벌 오버레이는, 현재 열린 오버레이다!
  closeBtn.onclick = function () {
    if (globalOverlay) {
      globalOverlay.setMap(null);
      closeOveray();
    }
  };

  var mainDiv = document.createElement("div");
  mainDiv.className = "custom-overlay-main";
  mainDiv.innerHTML = `
    <div class="custom-overlay-left">
      <img class="overlay-apt-img" alt="none" src="https://images.unsplash.com/photo-1551766472-62096056b476?ixlib=rb-1.2.1&raw_url=true&q=80&fm=jpg&crop=entropy&cs=tinysrgb&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=836">
    </div>
    <div class="custom-overlay-right">
      <p>${data.buildYear}년 건축</p>
      <p>주소 : ${data.dongName} ${data.jibun}</p>
    </div>
  `;

  titleDiv.appendChild(closeBtn);
  content.appendChild(titleDiv);
  content.appendChild(mainDiv);
  customOverlay.setContent(content);
  return customOverlay;
}

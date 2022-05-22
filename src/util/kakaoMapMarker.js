/* global kakao */
let globalOverlay = null;

export function markerImage() {
  let imageSize = new kakao.maps.Size(30, 30); // 마커이미지의 크기입니다
  let imageOption = { offset: new kakao.maps.Point(27, 69) }; // 마커이미지의 옵션입니다. 마커의 좌표와 일치시킬 이미지 안에서의 좌표를 설정합니다.

  return new kakao.maps.MarkerImage(
    require(process.env.VUE_APP_KAKAOMAP_ICON),
    imageSize,
    imageOption
  );
}

// 마커 클릭시 오버레이 생성할 수 있도록 한다.
export function markerInfoWindow(data, marker, map, getAptDeals, closeOveray) {
  // 기본
  // var infowindow = new kakao.maps.InfoWindow({
  //   content: content, // 인포윈도우에 표시할 내용
  // });

  kakao.maps.event.addListener(marker, "click", function () {
    let customOverlay = makeMarkerOverlay(map, marker, data, getAptDeals, closeOveray);

    if (globalOverlay) {
      globalOverlay.setMap(null);
    }
    customOverlay.setMap(map);
    globalOverlay = customOverlay;
    getAptDeals(data.aptCode);
  });

  // kakao.maps.event.addListener(marker, "click", makeMarkerOverlay(map, marker));
}

function makeMarkerOverlay(map, marker, data, getAptDeals, closeOveray) {
  let customOverlay = new kakao.maps.CustomOverlay({
    position: marker.getPosition(),
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

  var content = document.createElement('div');
  content.className = 'wrap';
  content.innerHTML = data.aptName;
  content.style.backgroundColor = "skyblue";
      
  var closeBtn = document.createElement('button');
  closeBtn.innerHTML = '닫기';
  
  // 닫기버튼을 누르면 글로벌 오버레이를 닫는다.
  // 한 번 오버레이 열었다면 글로벌 오버레이는, 현재 열린 오버레이다!
  closeBtn.onclick = function() {
    if(globalOverlay) {
      globalOverlay.setMap(null);
      closeOveray();
    }
  };

  content.appendChild(closeBtn);
  customOverlay.setContent(content);
  return customOverlay;
}

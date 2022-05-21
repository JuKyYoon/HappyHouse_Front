/* global kakao */

let imageSize = new kakao.maps.Size(30, 30); // 마커이미지의 크기입니다
let imageOption = { offset: new kakao.maps.Point(27, 69) }; // 마커이미지의 옵션입니다. 마커의 좌표와 일치시킬 이미지 안에서의 좌표를 설정합니다.

export function markerImage() {
  return new kakao.maps.MarkerImage(
    require(process.env.VUE_APP_KAKAOMAP_ICON),
    imageSize,
    imageOption
  );
}

// 마커 클릭시 오버레이 생성할 수 있도록 한다.
export function markerInfoWindow(data, marker, map, getAptDeals) {
  // 기본
  // var infowindow = new kakao.maps.InfoWindow({
  //   content: content, // 인포윈도우에 표시할 내용
  // });

  kakao.maps.event.addListener(marker, "click", function() {
    makeMarkerOverlay(map, marker, data, getAptDeals)
  });

  // kakao.maps.event.addListener(marker, "click", makeMarkerOverlay(map, marker));
}

function makeMarkerOverlay(map, marker, data, getAptDeals) {

  var customOverlay = new kakao.maps.CustomOverlay({
    position: marker.getPosition(),
  });

  let content = `<div class="wrap">
        <div class="info">
            <div class="title">
             ${data.aptName}
               <div class="closeOverLayButton" title="닫기"></div>
           </div>
            <div class="body">
                <div class="img">
               </div>
                <div class="desc">
                    aaaaaaaaaaaaaaaaaaaaaaaa
                </div>
            </div>
        </div>
    </div>`;

  customOverlay.setContent(content);
  customOverlay.setMap(map);

  kakao.maps.event.addListener(map, "click", function() {
    customOverlay.setMap(null)
  });

  getAptDeals();
}

import {debounce} from 'lodash';
import store from "@/store/index.js";
export default function (map, boundary) {
  // 마우스 드래그로 지도 이동이 완료되었을 때 마지막 파라미터로 넘어온 함수를 호출하도록 이벤트를 등록합니다
  // kakao.maps.event.addListener(map, "dragend", () => {
  //   // 지도 중심좌표를 얻어옵니다
  //   var latlng = map.getCenter();
  //   var level = map.getLevel();
  //   console.log(latlng, level);
  // });

  /* global kakao */
  kakao.maps.event.addListener(map, "bounds_changed", debounce(() => {
    // 지도 영역정보를 얻어옵니다
    var bounds = map.getBounds();

    // 영역정보의 남서쪽 정보를 얻어옵니다
    var swLatlng = bounds.getSouthWest();

    // 영역정보의 북동쪽 정보를 얻어옵니다
    var neLatlng = bounds.getNorthEast(); 

    // 남서쪽이 왼쪽하고 아래
    let bottom = swLatlng.Ma;
    let left = swLatlng.La;

    // 북동쪽이 오른쪽하고 위
    let top = neLatlng.Ma;
    let right = neLatlng.La;
    store.commit("mapStore/setBoundary", {top:top, bottom:bottom, left:left, right:right})
    // var message =
    //   "<p>영역좌표는 남서쪽 위도, 경도는  " + swLatlng.toString() + "이고 <br>";
    // message += "북동쪽 위도, 경도는  " + neLatlng.toString() + "입니다 </p>";
    // console.log(message)
  }, 200));
}

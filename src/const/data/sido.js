/*
시도 별 거래내역 횟수
( 취소 포함 )
SELECT sidoName, count(*) FROM hhouse.housedeal as d join hhouse.houseinfo as h using (aptCode) join hhouse.sidocode as s on (left(s.sidoCode, 2) =left(dongCode,2)) group by sidoName;
[
  43380, 41794, 18936, 40433, 25554, 16174, 16352, 1536, 154500, 28909, 29827,
  38505, 13114, 10159, 16855, 29290, 1785,
];

SELECT sidoName, count(*) FROM hhouse.housedeal as d join hhouse.houseinfo as h using (aptCode) join hhouse.sidocode as s on (left(s.sidoCode, 2) =left(dongCode,2)) where d.cancel != 'O' group by sidoName;
*/
export const dealCountEachSido = [
  41993, 39678, 18163, 38605, 24381, 15558, 15611, 147229, 27521, 28308, 36548,
  12434, 9691, 16077, 27996, 1673, 1467,
];

/*
월별 거래내역 횟수
SELECT month, count(*) FROM hhouse.housedeal where cancel is not null group by month;
*/
export const dealCountEachMonth = [
  50002, 41812, 48079, 41376, 46015, 40556, 58797, 56411, 45146, 43462, 30071,
  25376,
];

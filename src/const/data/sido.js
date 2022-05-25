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
  26761, 19479, 35133, 53846, 3735, 3447,
];

/*
월별 거래내역 횟수
SELECT month, count(*) FROM hhouse.housedeal where cancel = '' group by month;

*/
export const dealCountEachMonth = [
  59586, 50262, 59587, 51979, 56685, 50836, 56212, 53804, 42840, 41238, 28671,
  24296,
];

/**
지역별 평균 가격
SELECT sidoName, avg( CAST(REPLACE(REPLACE(money, ",", ""), ".", "") AS DECIMAL) ) FROM hhouse.housedeal as d join hhouse.houseinfo as h using (aptCode) join hhouse.sidocode as s on (left(s.sidoCode, 2) =left(dongCode,2)) where d.cancel != 'O' group by sidoName;
*/
export const dealAvgMoneyEachSido = [
  102123, 31177, 28849, 33909, 25913, 31420, 25927, 44936, 17116, 17293, 17969,
  16167, 16206, 16344, 21165, 30003, 44878,
];

/**

서울시 구별 매매횟수
SELECT gugunName as label , count(no) as value FROM hhouse.houseinfo as h join hhouse.houseDeal as d using (aptCode) join hhouse.baseaddress using (dongCode) where d.cancel = '' and sidoName="서울특별시" group by gugunName;

월별 매매횟수
SELECT d.month as label , count(no)  as value  FROM hhouse.houseinfo as h join hhouse.houseDeal as d using (aptCode) join hhouse.baseaddress using (dongCode) where d.cancel = '' and sidoName="서울특별시" group by d.month;

월 별 평균 매매가
SELECT d.month as label, avg(CAST(REPLACE(REPLACE(money, ",", ""), ".", "") AS DECIMAL))  as value  FROM hhouse.houseinfo as h join hhouse.houseDeal as d using (aptCode) join hhouse.baseaddress using (dongCode) where d.cancel = '' and sidoName="서울특별시" group by d.month;

구 별 평균 매매가
SELECT b.gugunName as label, avg(CAST(REPLACE(REPLACE(money, ",", ""), ".", "") AS DECIMAL)) as value FROM hhouse.houseinfo as h join hhouse.houseDeal as d using (aptCode) join hhouse.baseaddress as b using (dongCode) where d.cancel = '' and sidoName="서울특별시" group by gugunName;

상위 50개
SELECT aptName as label, CAST(REPLACE(REPLACE(money, ",", ""), ".", "") AS DECIMAL) as value FROM hhouse.houseinfo as h join hhouse.houseDeal as d using (aptCode) join hhouse.baseaddress using (dongCode) where d.cancel = '' and sidoName="서울특별시" order by value desc limit 50;

*/


export function fetchData() {
  const data = [];
  for (let i = 0; i < 1000 * 10; i++) {
    data.push({
      name: Mock.Random.cname(),
      bird: Mock.Random.date('yyyy年MM月dd日'),
      avatar: 'https://pic.rmb.bdstatic.com/bjh/794663bacf1aa85efaae82dd9be486f5.png',
    });
  }
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(data);
    }, 500);
  });
}

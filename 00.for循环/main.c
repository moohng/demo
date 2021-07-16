#include <stdio.h>
#include <stdlib.h>
#include <time.h>

int main(void) {
  clock_t start, finish;
  start = clock();

  int sum = 0;
  // int len = 20000; // 547ms
  // for (int i = 0; i < len; i++) {
  //   for (int j = 0; j < len; j++) {
  //     sum++;
  //   }
  // }

  for (int i = 0; i < 1000000000; i++) {
    sum++;
  }

  finish = clock();

  double duration = (double)(finish - start);
  printf("%d\n", sum);
  printf("%f ms\n", duration);

  return 0;
}

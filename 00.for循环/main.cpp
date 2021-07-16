#include <iostream>
#include <ctime>

using namespace std;

int main() {
  clock_t start, end;
  start = clock();

  int sum = 0;
  int len = 20000; // 539ms
  for (int i = 0; i < len; i++) {
    for (int j = 0; j < len; j++) {
      sum++;
    }
  }

  end = clock();
  cout << (double)(end - start) << "ms" << endl;

  system("pause");
  return 0;
}

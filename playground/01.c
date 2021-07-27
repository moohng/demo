#include <stdio.h>
#include <time.h>
#include <stdlib.h>

typedef int long un;

long long a = 1231;

int main() {
  // struct tm *m;
  time_t t =  time(NULL);
  printf("%d\n", t);

  system("pause");
}

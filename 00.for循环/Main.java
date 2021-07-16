public class Main {
  public static void main(String[] args) {
    long start = System.currentTimeMillis();

    long sum = 0;
    // long length = 20000; // 136ms
    // for (long i = 0; i < length; i++) {
    //   for (long j = 0; j < length; j++) {
    //     sum++;
    //   }
    // }

    for (long i = 0; i < 1000000000l; i++) {
      sum++;
    }

    long end = System.currentTimeMillis();
    System.out.println(sum);
    System.out.println((end - start) + "ms");
  }
}

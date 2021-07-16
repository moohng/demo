package lib;

public class Tool2 {
  public static int[] generateArray(int length) {
    return new int[length];
  }

  public static float random(int start, int end) {
    return start + Math.random() * (end - start);
  }

  public static int random(int start, int end, boolean isInt) {
    return (int) start + Math.random() * (end - start);
  }
}

import java.util.Arrays;

public class Main {
  public static void main(String[] args) {
    int[] digits = {1, 2, 3};
    int len = digits.length;
    for (int i = len - 1; i >= 0; i--) {
      if (digits[i] == 9) {
        digits[i] = 0;
        if (i == 0) {
          int[] temp = new int[len + 1];
          temp[0] = 1;
        }
      } else {
        digits[i]++;
        break;
      }
    }

    System.out.println(Arrays.toString(digits));
  }
}

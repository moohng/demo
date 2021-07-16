import java.util.Arrays;
import java.lang.Math;

class Solution {

    public static void main(String[] args) {
        Solution solution = new Solution();
        int length = 1000000;
        int[] nums1 = new int[length];
        int[] nums2 = new int[length];
        for (int i = 0; i < length; i++) {
            nums1[i] = Tool2.random(0, length, true);
            nums2[i] = i * 2;
        }

        long startTime = System.currentTimeMillis();
        int[] result = solution.intersect(nums1, nums2);

        long endTime = System.currentTimeMillis();
        System.out.println((endTime - startTime) + "ms");
        // System.out.println(Arrays.toString(nums1));
        // System.out.println(Arrays.toString(nums2));
        // System.out.println(Arrays.toString(result));
    }

    public int[] intersect(int[] nums1, int[] nums2) {
        int len1 = nums1.length, len2 = nums2.length;
        int len = len1<len2?len1:len2;
        int[] ans = new int[len];
        if(len1 == 0 || len2 == 0){  //处理边界条件
            return ans;
        }
        Arrays.sort(nums1);
        Arrays.sort(nums2);
        int i=0, j=0, k=0;
        while(i<len1 && j<len2){
            if(nums1[i] == nums2[j]){
                ans[k++] = nums1[i];
                i++;
                j++;
            }else if(nums1[i] < nums2[j]){
                i++;
            }else{
                j++;
            }
        }
        return Arrays.copyOfRange(ans, 0, k);
    }
}

class Tool2 {
    public static int[] generateArray(int length) {
        return new int[length];
    }

    public static double random(int start, int end) {
        return start + Math.random() * (end - start);
    }

    public static int random(int start, int end, boolean isInt) {
        return (int) ((int) start + Math.random() * (end - start));
    }
}

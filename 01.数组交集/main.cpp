#include <algorithm>

class Solution {
public:
    vector<int> intersect(vector<int>& nums1, vector<int>& nums2) {
        vector<int>target;
        sort(nums1.begin(),nums1.end());
        sort(nums2.begin(),nums2.end());
        for(vector<int>::iterator it1=nums1.begin(),it2=nums2.begin();it1!=nums1.end()&&it2!=nums2.end();)
        {
            if(*it1<*it2 ) it1++;
            else if(*it1==*it2)
            {
                target.push_back(*it1);
                 it1++;
                 it2++;
            }
            else if(*it1>*it2 ) it2++;
        }
        return target;
    }
};

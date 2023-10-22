using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Services;

namespace SortWebService
{
    /// <summary>
    /// WebService1 的摘要说明
    /// </summary>
    [WebService(Namespace = "http://tempuri.org/")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    [System.ComponentModel.ToolboxItem(false)]
    // 若要允许使用 ASP.NET AJAX 从脚本中调用此 Web 服务，请取消注释以下行。 
    // [System.Web.Script.Services.ScriptService]
    public class SortService : System.Web.Services.WebService
    {
        // Web服务方法：使用快速排序对传入的数组进行排序
        [WebMethod]
        public int[] SortNumbers(int[] numbers)
        {
            QuickSort(numbers, 0, numbers.Length - 1);
            return numbers;
        }

        // 快速排序的主要方法
        [WebMethod]
        private void QuickSort(int[] numbers, int low, int high)
        {
            if (low < high)
            {
                int pivot = Partition(numbers, low, high);
                QuickSort(numbers, low, pivot - 1);
                QuickSort(numbers, pivot + 1, high);
            }
        }

        // 快速排序的分区函数：选择一个基准值并使得比基准小的值都在左边，比基准大的值都在右边

        private int Partition(int[] numbers, int low, int high)
        {
            int pivot = numbers[high];
            int i = (low - 1);

            for (int j = low; j <= high - 1; j++)
            {
                if (numbers[j] < pivot)
                {
                    i++;
                    Swap(ref numbers[i], ref numbers[j]);
                }
            }
            Swap(ref numbers[i + 1], ref numbers[high]);
            return i + 1;
        }

        // 用于交换两个数组元素的辅助函数

        private void Swap(ref int a, ref int b)
        {
            int temp = a;
            a = b;
            b = temp;
        }
    }
}

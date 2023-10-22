using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using SortWebService.localhost;

namespace SortWebService
{
    public partial class SortCall : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {

        }
        protected void btnSort_Click(object sender, EventArgs e)
        {
            // 创建Web服务的代理类实例
            localhost.SortService client = new localhost.SortService();

            // 从输入框读取数字并转化为整数数组
            int[] numbers = txtInput.Text.Split(',').Select(n => Convert.ToInt32(n.Trim())).ToArray();

            // 调用Web服务的排序方法
            int[] sortedNumbers = client.SortNumbers(numbers);

            // 显示排序结果
            lblResult.Text = string.Join(", ", sortedNumbers);
        }


    }
}

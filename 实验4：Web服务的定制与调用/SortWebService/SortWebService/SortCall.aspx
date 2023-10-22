<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="SortCall.aspx.cs" Inherits="SortWebService.SortCall" %>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>实验4：Web服务的定制与调用</title>
    <link rel="stylesheet" type="text/css" href="Style/Sort.css">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
</head>
<body>

<div class="page-header">实验4：Web服务的定制与调用</div>
<form class="form" id="form1" runat="server">
    <p class="title">数值排序 </p>
    <p class="message">请在下面的框内输入一行数字，每个数字间以“,”间隔 </p>
            
    <label>
        <asp:TextBox ID="txtInput" runat="server" CssClass="input" placeholder="" required=""></asp:TextBox>
        <span>输入待排序数组</span>
    </label> 
    <asp:Button ID="btnSort" runat="server" CssClass="submit" Text="Submit" OnClick="btnSort_Click" />
    <asp:Label ID="lblResult" runat="server" CssClass="input" Text="" placeholder="" ></asp:Label>
</form>


<footer class="footer">
    <p> 2021级软件工程03班FangHeng. All Rights Reserved.</p>
</footer>

</body>
</html>

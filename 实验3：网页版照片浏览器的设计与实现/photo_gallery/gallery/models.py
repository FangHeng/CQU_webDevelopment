from django.db import models
import uuid

class Fileinfo(models.Model):
    # 文件号，用UUID来生成不重复数字
    file_number = models.UUIDField(default=uuid.uuid4, editable=False, unique=True, primary_key=True)
    # 文件名
    file_name = models.CharField(max_length=200, default='default_filename')
    # 文件地址
    file_url = models.URLField(max_length=200)
    # 文件上传日期，auto_now_add设置为True会在创建时自动设置当前日期
    upload_date = models.DateField(auto_now_add=True)
    # 备注
    remarks = models.TextField(blank=True, null=True)
    # 照片地点
    location = models.CharField(max_length=200, null=True, blank=True)
    # 照片国家
    country = models.CharField(max_length=200, null=True, blank=True)
    # 照片省份
    province = models.CharField(max_length=200, null=True, blank=True)
    # 照片城市
    city = models.CharField(max_length=200, null=True, blank=True)
    # 照片区县
    district = models.CharField(max_length=200, null=True, blank=True)
    # 照片拍摄时间
    time = models.DateTimeField(null=True, blank=True)


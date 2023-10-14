from PIL import Image
from PIL.ExifTags import TAGS, GPSTAGS
from datetime import datetime
from gallery.locationAcquisition import get_address_info


def get_exif_data(image_path):
    """
    获取图像的EXIF数据。
    """
    with Image.open(image_path) as image:
        return image._getexif()


def get_shot_time(exif_data):
    """
    从EXIF数据中提取拍摄时间。
    """
    for tag, value in exif_data.items():
        tag_name = TAGS.get(tag, tag)
        if tag_name == 'DateTimeOriginal':
            return datetime.strptime(value, '%Y:%m:%d %H:%M:%S')
    return None


def get_gps_info(exif_data):
    """
    从EXIF数据中提取GPS信息。
    """
    for tag, value in exif_data.items():
        tag_name = TAGS.get(tag, tag)
        if tag_name == 'GPSInfo':
            gps_info = {}
            for t, v in value.items():
                sub_tag_name = GPSTAGS.get(t, t)
                gps_info[sub_tag_name] = v
            lat_data = gps_info.get("GPSLatitude", None)
            lon_data = gps_info.get("GPSLongitude", None)
            if lat_data and lon_data:
                lat = float(lat_data[0]) + float(lat_data[1]) / 60 + float(lat_data[2]) / 3600
                lon = float(lon_data[0]) + float(lon_data[1]) / 60 + float(lon_data[2]) / 3600
                return lat, lon
    return None, None


def get_image_info(image_path):
    """
    获取图像的拍摄时间和拍摄地点信息。
    """
    exif_data = get_exif_data(image_path)
    shot_time = get_shot_time(exif_data)
    lat, lon = get_gps_info(exif_data)
    address_info = None
    if lat and lon:
        address_info = get_address_info(lat, lon)
    return {
        'shot_time': shot_time,
        'address_info': address_info
    }

if __name__ == "__main__":
    # 使用函数
    image_path = 'C:\\Users\\Windows 10\\Desktop\\23-24第一学期杂货\\CQU_webDevelopment\\实验3：网页版照片浏览器的设计与实现\\photo_gallery\\test\\1.JPG'
    image_info = get_image_info(image_path)
    print(image_info)

# encoding:utf-8
# 检测到您当前的AK设置了IP白名单校验
# 您的IP白名单中的IP非公网IP，请设置为公网IP，否则将请求失败
# 请在IP地址为0.0.0.0/0 外网IP的计算发起请求，否则将请求失败
import requests

def get_location_info(latitude, longitude, ak):
    # 服务地址
    host = "https://api.map.baidu.com"

    # 接口地址
    uri = "/reverse_geocoding/v3"

    params = {
        "ak": ak,
        "output": "json",
        "coordtype": "wgs84ll",
        "extensions_poi": "0",
        "location": f"{latitude},{longitude}",
    }

    response = requests.get(url=host + uri, params=params)

    if response:
        return response.json()
    else:
        return None


def extract_required_fields(data):
    # 从data中提取需要的信息
    formatted_address = data.get('result', {}).get('formatted_address', '')
    addressComponent = data.get('result', {}).get('addressComponent', {})

    country = addressComponent.get('country', '')
    province = addressComponent.get('province', '')
    city = addressComponent.get('city', '')
    district = addressComponent.get('district', '')

    # 将提取的信息存放在一个新的字典中
    extracted_data = {
        'formatted_address': formatted_address,
        'country': country,
        'province': province,
        'city': city,
        'district': district
    }

    return extracted_data


def get_address_info(latitude, longitude, ak="hO8ZGzGbRtLjBLuNNAEvHuUNOtgpWhNB"):
    # 从百度API获取位置信息
    data = get_location_info(latitude, longitude, ak)
    if not data:
        return None

    # 从返回的数据中提取所需的字段
    extracted_data = extract_required_fields(data)

    return extracted_data



if __name__ == "__main__":
    latitude = 31.225696563611
    longitude = 121.49884033194
    result = get_address_info(latitude, longitude)
    print(result)
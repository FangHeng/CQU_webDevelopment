import os
from django.http import JsonResponse
from django.core.files.storage import FileSystemStorage
from django.shortcuts import render
from .models import Fileinfo
from gallery.getInformation import get_image_info
from django.views.decorators.csrf import csrf_exempt

def index(request):
    # 查询数据库中最新上传的五个文件
    latest_files = Fileinfo.objects.order_by('-upload_date')[:5]
    return render(request, 'index.html', {'latest_files': latest_files})


def upload(request):
    return render(request, 'upload.html')

def gallery(request):
    condition = request.GET.get('condition', 'upload_date')  # 默认为上传时间
    order = request.GET.get('order', 'asc')  # 默认为升序
    country = request.GET.get('country', None)
    province = request.GET.get('province', None)
    city = request.GET.get('city', None)
    district = request.GET.get('district', None)
    # print(f"country: {country}")
    # print(f"province: {province}")
    # print(f"city: {city}")
    # print(f"district: {district}")


    # 开始构建查询条件
    query_conditions = {}
    if country:
        query_conditions['country'] = country
    if province:
        query_conditions['province'] = province
    if city:
        query_conditions['city'] = city
    if district:
        query_conditions['district'] = district

    # 根据选择的排序方式进行排序
    query_condition = condition
    if order == 'desc':
        query_condition = '-' + condition

    files = list(Fileinfo.objects.filter(**query_conditions).order_by(query_condition))


    # print(f"Sorting by {condition}")  # For debugging
    # print(f"Order: {order}")  # For debugging
    # print(files)  # For debugging



    # 将文件分为三组
    files_column1 = [f for i, f in enumerate(files) if i % 3 == 0]
    files_column2 = [f for i, f in enumerate(files) if i % 3 == 1]
    files_column3 = [f for i, f in enumerate(files) if i % 3 == 2]

    # 获取所有独特的地点数据
    countries = Fileinfo.objects.values_list('country', flat=True).distinct()
    # provinces = Fileinfo.objects.values_list('province', flat=True).distinct()
    # cities = Fileinfo.objects.values_list('city', flat=True).distinct()
    # districts = Fileinfo.objects.values_list('district', flat=True).distinct()

    context = {
        'files_cols': [files_column1, files_column2, files_column3],
        'selected_condition': condition,
        'selected_order': order,
        'selected_country': country,
        'selected_province': province,
        'selected_city': city,
        'selected_district': district,
        'countries': countries,
        # 'provinces': provinces,
        # 'cities': cities,
        # 'districts': districts,
    }

    return render(request, 'gallery.html', context)

@csrf_exempt
def upload_files(request):
    if request.method == 'POST':
        print(request)
        files = request.FILES.getlist('file')
        print(files)
        name = request.POST.get('title', '')  # 获取姓名
        description = request.POST.get('description', '')  # 获取备注
        try:
            for file in files:
                # 创建以用户id和日期命名的文件夹
                fs = FileSystemStorage(location=os.path.join('gallery/static/upload/'))
                filename = fs.save(file.name, file)
                file_path = fs.path(filename)
                static_index = file_path.index("gallery\\static\\") + len("gallery\\static\\")
                desired_path = file_path[static_index:]
                print(desired_path)
                print(file_path)

                # 获取照片信息
                image_info = get_image_info(file_path)
                print(image_info)
                shot_time = image_info.get('shot_time', None)
                address_info = image_info.get('address_info', None)

                # shot_time_str = shot_time.strftime('%Y-%m-%d %H:%M:%S') if shot_time else None

                # 添加文件信息到数据库
                Fileinfo.objects.create(
                    file_name=name,
                    file_url=desired_path,
                    remarks=description,
                    location=address_info.get('formatted_address', None) if address_info else None,
                    country=address_info.get('country', None) if address_info else None,
                    province=address_info.get('province', None) if address_info else None,
                    city=address_info.get('city', None) if address_info else None,
                    district=address_info.get('district', None) if address_info else None,
                    time=shot_time
                )
            return JsonResponse({'status': 'success'})  # 成功时返回的JSON对象
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)})  # 失败时返回的JSON对象，包含错误信息
    else:
        return render(request, "upload_files.html")


def get_location_data(request):
    country = request.GET.get('country')
    province = request.GET.get('province')
    city = request.GET.get('city')
    # print(f"country: {country}")
    # print(f"province: {province}")
    # print(f"city: {city}")

    data = {}

    if country:
        data['provinces'] = list(Fileinfo.objects.filter(country=country).values_list('province', flat=True).distinct())
        print(data['provinces'])
    if province:
        data['cities'] = list(Fileinfo.objects.filter(province=province).values_list('city', flat=True).distinct())
    if city:
        data['districts'] = list(Fileinfo.objects.filter(city=city).values_list('district', flat=True).distinct())

    return JsonResponse(data)
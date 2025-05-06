from django.urls import path
from . import views
from .views import booking_dashboard
from .views import get_room_types

urlpatterns = [
    path('booking/', views.BookingViewset.as_view()),
    path('booking/detail/', views.BookingDetailViewset.as_view()),
    path('hotelinf/', views.HotelInformationViewset.as_view()),
    #path('booking/detail/cancel/', views.CancelBookingDetails.as_view()),
    path('hotel/search', views.SearchHotelsView.as_view(), name='search_hotels'),
    path('hotel/detail/', views.HotelHasRoomTypeView.as_view(), name='hotel_room_type'),
    path('guest/booking/', views.BookingCreateView.as_view(), name='create_booking'),
    


    path('roomtypes/', get_room_types, name='get_room_types'),
    path('dashboard/', booking_dashboard, name='booking_dashboard'),

    path('booking/cancel/', views.cancel_booking, name='cancel_booking'),
    path('booking/checkout/', views.checkout_booking, name='checkout_booking'),
    

    path('hotel/search', views.SearchHotelsView.as_view(), name='search_hotels'),
    path('hotel/detail/', views.GuestHotelHasRoomTypeView.as_view(), name='hotel_room_type'),
    path('guest/booking/', views.BookingCreateView.as_view(), name='create_booking'),

    path('user/', views.UserViewset.as_view()),
    path('payment/', views.PaymentViewset.as_view()),
    path('user/payments/', views.UserPaymentsViewset.as_view()),
 
    path('roomtype/', views.RoomTypeWithServicesView.as_view()),
    path('rooms/', views.RoomListView.as_view()),
    path('rooms/<int:room_no>/', views.RoomListView.as_view()),
    # path('rooms/<int:room_no>/', views.RoomDetailView.as_view())
]
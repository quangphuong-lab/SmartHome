# Smart Home System - Web Dashboard & Firebase

**Tên dự án: Hệ thống Nhà thông minh (Smart Home System)**

**Sinh viên thực hiện**

* Nguyễn Quang Phương – MSSV: 23161168
* Trần Bá Tiến Phát – MSSV: 23161164
* Nguyễn Trí Long – MSSV: 22161018

**Trường:** Đại học Công Nghệ Kỹ thuật TP.HCM (UTE)

**Môn học:** Thực tập Cơ sở và Ứng dụng IoT

**Giảng viên hướng dẫn:** Trương Quang Phúc

---

# Tổng quan dự án

Dự án xây dựng một hệ thống nhà thông minh ứng dụng công nghệ IoT nhằm hỗ trợ giám sát và điều khiển các thiết bị trong gia đình thông qua giao diện Web. Hệ thống cho phép người dùng điều khiển các thiết bị như đèn, điều hòa và khóa cửa, đồng thời theo dõi các thông số môi trường và điện năng tiêu thụ theo thời gian thực. Việc trao đổi dữ liệu giữa vi điều khiển ESP32 và giao diện Web được thực hiện thông qua Firebase Realtime Database, giúp đồng bộ trạng thái của thiết bị và dữ liệu cảm biến.

# Các tính năng nổi bật

* **Giám sát môi trường và điện năng theo thời gian thực:** Hệ thống hiển thị các thông số như nhiệt độ (°C), độ ẩm (%) và điện năng tiêu thụ (kWh). Dữ liệu được cập nhật liên tục trên giao diện Web và được biểu diễn dưới dạng biểu đồ thống kê trong khoảng thời gian từ 1 đến 7 ngày.

* **Điều khiển thiết bị từ giao diện Web:** Người dùng có thể thực hiện các thao tác:

  * Đóng hoặc mở khóa cửa.
  * Bật hoặc tắt điều hòa.
  * Điều chỉnh độ sáng của đèn thông qua thanh trượt (0–100%).

* **Đồng bộ dữ liệu giữa Web và thiết bị:** Khi trạng thái thiết bị thay đổi từ giao diện Web, dữ liệu sẽ được cập nhật lên Firebase và gửi đến ESP32 để thực hiện điều khiển. Ngược lại, nếu trạng thái thiết bị thay đổi từ phía phần cứng, giao diện Web cũng được cập nhật tương ứng nhằm đảm bảo dữ liệu luôn thống nhất. Hệ thống sử dụng cơ chế khóa vòng lặp điều khiển để hạn chế việc cập nhật lặp không cần thiết.

* **Giao diện trực quan:** Web Dashboard được thiết kế với giao diện dễ sử dụng, hiển thị trạng thái hoạt động của các thiết bị thông qua màu sắc, hiệu ứng của biểu tượng và đồng hồ thời gian thực, giúp người dùng dễ dàng theo dõi và điều khiển hệ thống.

# Linh kiện và công nghệ sử dụng

## 1. Phần cứng (Hardware)

* **Vi điều khiển:** ESP32, đảm nhiệm việc thu thập dữ liệu từ cảm biến, điều khiển các thiết bị và kết nối với mạng Wi-Fi.

* **Cảm biến môi trường:** Module đo nhiệt độ và độ ẩm (DHT11 hoặc DHT22).

* **Cảm biến năng lượng:** Module đo điện năng (PZEM-004T hoặc ACS712) dùng để đo dòng điện, điện áp và tính toán điện năng tiêu thụ.

* **Thiết bị chấp hành:**

  * Module PWM dùng để điều chỉnh độ sáng của đèn.
  * Module Relay dùng để điều khiển điều hòa và khóa cửa điện (Solenoid Lock).

## 2. Phần mềm và nền tảng (Software & Cloud)

* **Web Frontend:** HTML5, CSS3 và JavaScript được sử dụng để xây dựng giao diện điều khiển, hiển thị dữ liệu cảm biến và biểu đồ thống kê mà không cần tải lại trang.

* **Cloud Platform:** Firebase Realtime Database được sử dụng làm cơ sở dữ liệu thời gian thực, lưu trữ trạng thái thiết bị và dữ liệu cảm biến, đồng thời đóng vai trò trung gian trao đổi dữ liệu giữa ESP32 và giao diện Web.

# BIT240029_FoodManager

Ứng dụng quản lý món ăn cho bài giữa kỳ, xây bằng **React Native + Expo**. Dữ liệu được lưu ngay trên thiết bị bằng AsyncStorage; khi cấu hình MockAPI, ứng dụng tự đồng bộ lại sau khi có Internet.

## Chạy ứng dụng

```bash
npm install
npm start
```

Mở Expo Go trên điện thoại và quét QR, hoặc nhấn `a` trong terminal để mở Android emulator. Cần Node.js/npm và Expo Go hoặc Android Studio.

## Mô hình dữ liệu

- `DishCategory`: `Id`, `Name`, `Description`.
- `Dish`: `Id`, `Name`, `Price`, `PreparationTime`, `IsAvailable`, `Description`, `DishCategoryId`, `DishImage[]`.
- Mỗi ảnh gồm `ImageUrl`, `IsThumbnail`; mỗi món giữ tối đa một ảnh đại diện.

AsyncStorage dùng key `BIT240029_FoodManager`. Các collection là `BIT240029_DishCategory` và `BIT240029_Dish`; các trường dữ liệu đều có tiền tố `BIT240029_`. Ảnh được lưu lồng trong bản ghi món dưới trường `BIT240029_DishImage`. Đây là lưu trữ key–value theo yêu cầu của phương án AsyncStorage, không phải SQLite quan hệ.

Ứng dụng có 3 danh mục và 5 món mẫu. Kiểm tra dữ liệu gồm tên không rỗng, giá và thời gian lớn hơn 0, danh mục tồn tại, tên món không trùng trong cùng danh mục.

## Chức năng đã làm

- Danh sách, chi tiết, thêm, sửa, xóa món và xác nhận trước khi xóa.
- Tìm theo tên; lọc kết hợp theo danh mục, trạng thái đang bán và khoảng giá; sắp xếp theo giá tăng/giảm hoặc thời gian chế biến.
- Tạo danh mục; chặn xóa danh mục còn món tham chiếu.
- Thêm nhiều ảnh bằng URL, đổi ảnh đại diện; nhãn Quick khi thời gian không quá 15 phút, nếu không là Regular.
- English mặc định, chuyển English ↔ Tiếng Việt; ngôn ngữ và dữ liệu giữ lại sau khi thoát ứng dụng.
- Tạo/sửa/xóa offline và lưu thay đổi tại máy. Tự thử đồng bộ lại khi dữ liệu đổi, khi mở lại ứng dụng và định kỳ mỗi 20 giây. Mỗi bản ghi gửi lên có `BIT240029_ClientId` ổn định để tạo/sửa không bị nhân đôi; thao tác xóa được giữ trong hàng đợi đến khi API nhận thành công.

## Cấu hình MockAPI

Tạo hai resources trong project MockAPI:

1. `BIT240029_DishCategory`
2. `BIT240029_Dish`

Trong ứng dụng, mở nút cài đặt ⚙ ở màn hình danh sách, dán **URL collection đầy đủ** của từng resource rồi lưu. Ví dụ URL thường có dạng `https://<project-id>.mockapi.io/api/v1/BIT240029_Dish`; URL của collection danh mục kết thúc bằng `BIT240029_DishCategory`.

Khi đã nhập cả hai URL, ứng dụng tự upsert dữ liệu local và nhận các bản ghi mới từ MockAPI. Tạo/sửa bản ghi dựa trên `BIT240029_ClientId`; nếu bản ghi chưa có, ứng dụng POST, còn nếu đã có thì PUT. Khi cùng một bản ghi bị sửa ở cả hai nơi, dữ liệu trên thiết bị được ưu tiên. Nếu để trống URL, toàn bộ chức năng local vẫn dùng được offline. Có nút “Sync now” trong cài đặt để thử đồng bộ thủ công khi cần.

## Gợi ý quay video

1. Hiện màn hình chính có mã BIT240029 và danh sách mẫu.
2. Thử tìm kiếm, chọn danh mục, chỉ xem món đang bán, đặt khoảng giá và sắp xếp.
3. Thêm món với hai ảnh, đổi ảnh đại diện, lưu và mở chi tiết.
4. Sửa món, xóa món có xác nhận; thử xóa danh mục đang được sử dụng.
5. Đổi ngôn ngữ, chuyển màn hình; thoát/mở ứng dụng để thể hiện dữ liệu còn lưu.
6. Nếu đã cấu hình MockAPI: tạo hoặc sửa món khi offline, bật lại Internet và kiểm tra bản ghi được tạo/cập nhật một lần trên MockAPI.

Project được chia thành `src/data` (model, lưu trữ, đồng bộ), `src/screens` (màn hình), `src/components` (UI dùng chung) và `src/i18n.js` (bản dịch) để tiện trình bày và giải thích mã nguồn.

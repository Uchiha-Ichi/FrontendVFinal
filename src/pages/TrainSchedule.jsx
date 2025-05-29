import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Button, Input, Modal, Form, message, Spin, Select, TimePicker } from "antd";
import { SearchOutlined } from '@ant-design/icons';
import moment from "moment";

// API base URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const TrainScheduleManager = () => {
  const [trainSchedules, setTrainSchedules] = useState([]);
  const [filteredTrainSchedules, setFilteredTrainSchedules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [form] = Form.useForm();
  const [selectedTrainName, setSelectedTrainName] = useState("");
  const [selectedRouteName, setSelectedRouteName] = useState("");

  // Lấy tất cả lịch tàu khi component load
  useEffect(() => {
    setLoading(true);
    axios
      .get(`${API_BASE_URL}train-schedules`)
      .then((response) => {
        setTrainSchedules(response.data);
        setFilteredTrainSchedules(response.data); // Lưu dữ liệu ban đầu
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Có lỗi xảy ra");
        setLoading(false);
      });
  }, []);

  // Lấy danh sách tên tàu và tuyến từ dữ liệu lịch tàu
  const trainNames = [...new Set(trainSchedules.map(schedule => schedule.train.trainName))];
  const routeNames = [...new Set(trainSchedules.map(schedule => schedule.train.route.routeName))];

  // Xử lý thay đổi khi người dùng chọn tên tàu để lọc
  const handleTrainNameFilterChange = (value) => {
    setSelectedTrainName(value);

    // Lọc danh sách dựa trên tên tàu được chọn
    const filteredData = trainSchedules.filter((schedule) =>
      schedule.train.trainName === value || value === ""
    );
    setFilteredTrainSchedules(filteredData);
  };

  // Xử lý thay đổi khi người dùng chọn tuyến để lọc
  const handleRouteNameFilterChange = (value) => {
    setSelectedRouteName(value);

    // Lọc danh sách dựa trên tuyến được chọn
    const filteredData = trainSchedules.filter((schedule) =>
      schedule.train.route.routeName === value || value === ""
    );
    setFilteredTrainSchedules(filteredData);
  };

  // Mở modal tạo mới lịch tàu
  const handleCreate = () => {
    setEditingSchedule(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  // Mở modal chỉnh sửa lịch tàu
  const handleEdit = (record) => {
    setEditingSchedule(record);  // Cập nhật lịch tàu cần chỉnh sửa
    form.setFieldsValue({
      trainId: record.train.trainId,  // Gán trainId cho trường "Tên tàu"
      stationId: record.station.stationId,  // Gán tên ga cho trường "Tên ga"
      departureTime: moment(record.departureTime, "HH:mm:ss"),  // Gán giờ đi
      arrivalTime: moment(record.arrivalTime, "HH:mm:ss"),  // Gán giờ đến
      day: record.day,  // Gán ngày
      distance: record.distance,  // Gán khoảng cách
    });
    setIsModalVisible(true);  // Mở modal để chỉnh sửa
  };
  

  // Xóa lịch tàu
  const handleDelete = (record) => {
    axios
      .delete(`${API_BASE_URL}train-schedules/${record.trainScheduleId}`)
      .then(() => {
        message.success("Xóa lịch tàu thành công!");
        // Reload lại danh sách lịch tàu sau khi xóa
        return axios.get(`${API_BASE_URL}train-schedules`);
      })
      .then((response) => {
        setTrainSchedules(response.data);
        setFilteredTrainSchedules(response.data); // Cập nhật lại dữ liệu lọc
      })
      .catch((err) => {
        message.error(err.message || "Xóa thất bại!");
      });
  };

  // Xử lý tạo mới hoặc cập nhật lịch tàu
  const handleSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        const scheduleData = { ...values };
  
        // Đảm bảo giá trị của `station` và `train` được lấy đúng
        scheduleData.station = { stationId: values.stationId }; // Ga đi (departureStation)
        scheduleData.train = { trainId: values.trainId }; // Tàu (trainId)
  
        // Lấy đúng giá trị giờ đi và giờ đến từ form
        scheduleData.departureTime = values.departureTime.format("HH:mm:ss");
        scheduleData.arrivalTime = values.arrivalTime.format("HH:mm:ss");
  
        // Lưu ý: Bạn có thể cần thêm các thông tin khác như `distance`, `day`...
        scheduleData.day = values.day;
        scheduleData.distance = values.distance;
  
        // Nếu đang chỉnh sửa, sử dụng PUT
        if (editingSchedule) {
          axios
            .put(`${API_BASE_URL}train-schedules/${editingSchedule.trainScheduleId}`, scheduleData)
            .then(() => {
              message.success("Cập nhật thành công!");
              setIsModalVisible(false);
              return axios.get(`${API_BASE_URL}train-schedules`);
            })
            .then((response) => {
              setTrainSchedules(response.data);
              setFilteredTrainSchedules(response.data);
            })
            .catch((err) => {
              message.error(err.message || "Cập nhật thất bại!");
            });
        } else {
          // Nếu tạo mới, sử dụng POST
          axios
            .post(`${API_BASE_URL}train-schedules`, scheduleData)
            .then(() => {
              message.success("Tạo lịch tàu thành công!");
              setIsModalVisible(false);
              return axios.get(`${API_BASE_URL}train-schedules`);
            })
            .then((response) => {
              setTrainSchedules(response.data);
              setFilteredTrainSchedules(response.data);
            })
            .catch((err) => {
              message.error(err.message || "Tạo lịch tàu thất bại!");
            });
        }
      })
      .catch(() => {
        message.error("Vui lòng kiểm tra lại thông tin!");
      });
  };

  // Định nghĩa các cột của bảng
  const columns = [
    { title: "Mã lịch tàu", dataIndex: "trainScheduleId", key: "trainScheduleId" },
    { title: "Tên ga", dataIndex: ["station", "stationName"], key: "stationName" },
    {
      title: "Tên tàu",
      dataIndex: ["train", "trainName"],
      key: "trainName",
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => (
        <div style={{ padding: 8 }}>
          <Select
            style={{ width: 200 }}
            placeholder="Chọn tên tàu"
            value={selectedKeys[0] || ""}
            onChange={(value) => {
              setSelectedKeys(value ? [value] : []);
              handleTrainNameFilterChange(value); // Lọc theo tên tàu
              confirm();
            }}
            allowClear
          >
            <Select.Option value="">Tất cả</Select.Option>
            {trainNames.map((trainName) => (
              <Select.Option key={trainName} value={trainName}>
                {trainName}
              </Select.Option>
            ))}
          </Select>
        </div>
      ),
      onFilter: (value, record) => record.train.trainName.indexOf(value) === 0,
      filterIcon: () => (
        <SearchOutlined style={{ fontSize: 20, color: '#1890ff' }} />
      ),
    },
    {
      title: "Tuyến",
      dataIndex: ["train", "route", "routeName"],
      key: "routeName",
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => (
        <div style={{ padding: 8 }}>
          <Select
            style={{ width: 200 }}
            placeholder="Chọn tuyến"
            value={selectedKeys[0] || ""}
            onChange={(value) => {
              setSelectedKeys(value ? [value] : []);
              handleRouteNameFilterChange(value); // Lọc theo tuyến
              confirm();
            }}
            allowClear
          >
            <Select.Option value="">Tất cả</Select.Option>
            {routeNames.map((routeName) => (
              <Select.Option key={routeName} value={routeName}>
                {routeName}
              </Select.Option>
            ))}
          </Select>
        </div>
      ),
      onFilter: (value, record) => record.train.route.routeName.indexOf(value) === 0,
      filterIcon: () => (
        <SearchOutlined style={{ fontSize: 20, color: '#1890ff' }} />
      ),
    },
    { title: "Giờ đi", dataIndex: "departureTime", key: "departureTime" },
    { title: "Giờ đến", dataIndex: "arrivalTime", key: "arrivalTime" },
    { title: "Khoảng cách", dataIndex: "distance", key: "distance" },
    { title: "Ngày", dataIndex: "day", key: "day" },
    {
      title: "Hành động",
      key: "actions",
      render: (text, record) => (
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button
            type="primary"
            style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}
            onClick={() => handleEdit(record)}
          >
            Sửa
          </Button>
          <Button
            type="primary"
            danger
            style={{ backgroundColor: '#ff4d4f', borderColor: '#ff4d4f' }}
            onClick={() => handleDelete(record)}
          >
            Xóa
          </Button>
        </div>
      ),
    }
  ];

  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '24px' }}>
        Quản lý lịch tàu chạy
      </h1>
      <div style={{ marginBottom: 16, textAlign: 'right' }}>
        <Button
          type="primary"
          onClick={handleCreate}
          disabled={loading}
        >
          Thêm lịch tàu
        </Button>
      </div>

      {/* Hiển thị thông tin lọc đã chọn */}
      {(selectedTrainName || selectedRouteName) && (
        <div style={{ marginBottom: 16 }}>
          <strong>Lọc theo:</strong>
          {selectedTrainName && <span style={{ marginLeft: 8 }}>Tên tàu: {selectedTrainName}</span>}
          {selectedRouteName && <span style={{ marginLeft: 8 }}>Tuyến: {selectedRouteName}</span>}
        </div>
      )}

      {loading ? (
        <Spin tip="Đang tải dữ liệu..." />
      ) : error ? (
        <div style={{ color: "red" }}>Có lỗi xảy ra: {error}</div>
      ) : (
        <Table
          rowKey="trainScheduleId"
          columns={columns}
          dataSource={filteredTrainSchedules}
          bordered
          className="custom-bordered-table"
        />
      )}

      <Modal
        title={editingSchedule ? "Sửa lịch tàu" : "Tạo lịch tàu"}
        open={isModalVisible}
        onOk={handleSubmit}
        onCancel={() => setIsModalVisible(false)}
        confirmLoading={loading}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Tên tàu"
            name="trainId"
            initialValue={editingSchedule ? editingSchedule.train.trainId : ""}
            rules={[{ required: true, message: "Vui lòng chọn tàu!" }]}
          >
            <Select>
              {Array.from(new Set(trainSchedules.map(schedule => schedule.train.trainId)))
                .map(trainId => {
                  const train = trainSchedules.find(schedule => schedule.train.trainId === trainId).train;
                  return (
                    <Select.Option key={train.trainId} value={train.trainId}>
                      {train.trainName}
                    </Select.Option>
                  );
                })}
            </Select>
          </Form.Item>

          <Form.Item
            label="Tên ga"
            name="stationId"
            initialValue={editingSchedule ? editingSchedule.station.stationId : ""}
            rules={[{ required: true, message: "Vui lòng chọn ga!" }]}
          >
            <Select>
              {Array.from(new Set(trainSchedules.map(schedule => schedule.station.stationId)))
                .map(stationId => {
                  const station = trainSchedules.find(schedule => schedule.station.stationId === stationId).station;
                  return (
                    <Select.Option key={station.stationId} value={station.stationId}>
                      {station.stationName}
                    </Select.Option>
                  );
                })}
            </Select>
          </Form.Item>

          <Form.Item
            label="Giờ đi"
            name="departureTime"
            initialValue={editingSchedule ? moment(editingSchedule.departureTime, "HH:mm:ss") : ""}
            rules={[{ required: true, message: "Vui lòng nhập giờ đi!" }]}
          >
            <TimePicker format="HH:mm" />
          </Form.Item>

          <Form.Item
            label="Giờ đến"
            name="arrivalTime"
            initialValue={editingSchedule ? moment(editingSchedule.arrivalTime, "HH:mm:ss") : ""}
            rules={[{ required: true, message: "Vui lòng nhập giờ đến!" }]}
          >
            <TimePicker format="HH:mm" />
          </Form.Item>

          <Form.Item
            label="Ngày"
            name="day"
            initialValue={editingSchedule ? editingSchedule.day : 1}
            rules={[{ required: true, message: "Vui lòng nhập ngày!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Khoảng cách"
            name="distance"
            initialValue={editingSchedule ? editingSchedule.distance : ""}
            rules={[{ required: true, message: "Vui lòng nhập khoảng cách!" }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default TrainScheduleManager;

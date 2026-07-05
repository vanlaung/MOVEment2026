import {EditOutlined, SaveOutlined} from "@ant-design/icons";
import {
  Alert,
  App as AntdApp,
  Button,
  Card,
  Drawer,
  Empty,
  Flex,
  Form,
  InputNumber,
  List,
  Modal,
  Select,
  Tag,
  Typography,
} from "antd";
import find from "lodash/find";
import sortBy from "lodash/sortBy";
import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {STATUS_ORDER} from "../constants";
import {useMovementStore} from "../store";
import type {TeamStation} from "../types";
import {
  formatDateTime,
  getDisabledReason,
  getStationStatusColor,
} from "../utils";

type QuickEditFormValues = Pick<TeamStation, "status" | "score">;

export function StationListPage() {
  const navigate = useNavigate();
  const {modal, message} = AntdApp.useApp();
  const session = useMovementStore((state) => state.session);
  const activeTeamId = useMovementStore((state) => state.activeTeamId);
  const teams = useMovementStore((state) => state.teams);
  const teamStations = useMovementStore((state) => state.teamStations);
  const startStation = useMovementStore((state) => state.startStation);
  const patchTeamStation = useMovementStore((state) => state.patchTeamStation);
  const [editingStation, setEditingStation] = useState<TeamStation | null>(
    null,
  );
  const [scanTarget, setScanTarget] = useState<TeamStation | null>(null);
  const [quickEditForm] = Form.useForm<QuickEditFormValues>();

  const team = teams.find((item) => item.id === activeTeamId);
  const sortedStations = sortBy(teamStations[activeTeamId] ?? [], [
    (station) => STATUS_ORDER[station.status],
    (station) => station.name,
  ]);
  const activeStation = find(
    sortedStations,
    (station) => station.status === "In Progress",
  );

  if (!session || !team) {
    return null;
  }

  const handleStationClick = (station: TeamStation) => {
    if (session.role !== "user") {
      navigate(`/stations/${station.stationId}`);
      return;
    }

    const disabledReason = getDisabledReason(station, activeStation);
    if (disabledReason) {
      message.warning(disabledReason);
      return;
    }

    if (station.status === "In Progress") {
      modal.confirm({
        title: "Bạn có muốn chơi lại không?",
        content:
          "Nếu tiếp tục, trạng thái trạm sẽ được quét lại để mở màn hình chi tiết.",
        okText: "Có",
        cancelText: "Không",
        onOk: () => setScanTarget(station),
      });
      return;
    }

    setScanTarget(station);
  };

  return (
    <Flex vertical gap={16} className="full-width">
      <Card className="surface-card compact-card">
        <div className="section-head">
          <div className="full-width">
            <Typography.Title level={3} className="section-title">
              Team hiện tại: {team.name}
            </Typography.Title>
            <Flex gap={4} justify="space-between" align="center">
              <Typography.Text className="muted-copy">
                Total Score: {team.score}
              </Typography.Text>
              <Typography.Text className="muted-copy">
                Finish: {team.finish}/{sortedStations.length}
              </Typography.Text>
            </Flex>
          </div>
        </div>
      </Card>

      <List
        className="card-list"
        dataSource={sortedStations}
        locale={{emptyText: <Empty description="Chưa có trạm" />}}
        renderItem={(station) => {
          return (
            <List.Item>
              <Card
                className="surface-card station-card"
                hoverable
                onClick={() => handleStationClick(station)}>
                <div className="station-row">
                  <div className="full-width">
                    <Flex
                      gap={8}
                      justify="space-between"
                      align="center"
                      className="full-width">
                      <Typography.Title level={4} className="card-title">
                        {station.name}
                      </Typography.Title>
                      <Tag color={getStationStatusColor(station.status)}>
                        {station.status}
                      </Tag>
                    </Flex>
                    <Typography.Paragraph className="muted-copy compact-copy">
                      Description: {station.description}
                    </Typography.Paragraph>
                    <Typography.Paragraph className="muted-copy compact-copy">
                      Duration: {station.duration}
                    </Typography.Paragraph>
                    <Flex gap={4} justify="space-between" align="center">
                      <Typography.Text className="muted-copy compact-copy">
                        {station.stationId}
                      </Typography.Text>
                      <Typography.Text className="muted-copy compact-copy">
                        Start: {formatDateTime(station.startTime)}
                      </Typography.Text>
                    </Flex>
                    <Flex gap={4} justify="space-between" align="center">
                      <Typography.Text className="muted-copy compact-copy">
                        Score: {station.score}
                      </Typography.Text>
                      <Typography.Text className="muted-copy compact-copy">
                        End: {formatDateTime(station.endTime)}
                      </Typography.Text>
                    </Flex>
                  </div>

                  {(session.role === "admin" ||
                    session.role === "system-admin") && (
                    <Button
                      icon={<EditOutlined />}
                      onClick={(event) => {
                        event.stopPropagation();
                        quickEditForm.setFieldsValue({
                          status: station.status,
                          score: station.score,
                        });
                        setEditingStation(station);
                      }}>
                      Quick Update
                    </Button>
                  )}
                </div>
              </Card>
            </List.Item>
          );
        }}
      />

      <Drawer
        title="Cập nhật nhanh trạm"
        placement="bottom"
        open={Boolean(editingStation)}
        onClose={() => setEditingStation(null)}
        destroyOnHidden>
        <Form
          form={quickEditForm}
          layout="vertical"
          onFinish={(values) => {
            if (!editingStation) {
              return;
            }

            modal.confirm({
              title: "Xác nhận cập nhật trạm",
              content: "Thay đổi này sẽ ghi đè trạng thái dummy data hiện tại.",
              okText: "Lưu",
              cancelText: "Hủy",
              onOk: () => {
                const now = new Date().toISOString();
                patchTeamStation(
                  editingStation.teamId,
                  editingStation.stationId,
                  {
                    status: values.status,
                    score: values.score,
                    startTime:
                      values.status === "New" ?
                        null
                      : (editingStation.startTime ?? now),
                    endTime:
                      values.status === "Finish" ?
                        (editingStation.endTime ?? now)
                      : null,
                  },
                );
                message.success("Đã cập nhật trạm");
                setEditingStation(null);
              },
            });
          }}>
          <Form.Item label="Status" name="status" rules={[{required: true}]}>
            <Select
              options={[
                {label: "New", value: "New"},
                {label: "In Progress", value: "In Progress"},
                {label: "Finish", value: "Finish"},
              ]}
            />
          </Form.Item>
          <Form.Item label="Score" name="score" rules={[{required: true}]}>
            <InputNumber min={0} max={1000} className="full-width" />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            icon={<SaveOutlined />}
            block>
            Save changes
          </Button>
        </Form>
      </Drawer>

      <Modal
        title="Scan QR để bắt đầu"
        open={Boolean(scanTarget)}
        onCancel={() => setScanTarget(null)}
        onOk={() => {
          if (!scanTarget) {
            return;
          }

          startStation(scanTarget.teamId, scanTarget.stationId);
          message.success("Scan QR code successfully");
          const stationId = scanTarget.stationId;
          setScanTarget(null);
          navigate(`/stations/${stationId}`);
        }}
        okText="Scan QR code successfully"
        cancelText="Đóng">
        <Flex vertical gap={12} className="full-width">
          <Typography.Text>
            Mô phỏng camera điện thoại cho trạm{" "}
            <strong>{scanTarget?.name}</strong>.
          </Typography.Text>
          <Alert
            type="success"
            showIcon
            description={
              <Flex vertical gap={4}>
                <Typography.Text strong>Luồng user</Typography.Text>
                <Typography.Text>
                  Sau khi scan thành công, trạng thái sẽ chuyển sang In Progress
                  và điều hướng sang màn hình Station Detail.
                </Typography.Text>
              </Flex>
            }
          />
        </Flex>
      </Modal>
    </Flex>
  );
}

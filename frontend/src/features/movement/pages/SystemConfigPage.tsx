import {EditOutlined} from "@ant-design/icons";
import {
  App as AntdApp,
  Button,
  Card,
  Flex,
  List,
  Space,
  Tabs,
  Typography,
} from "antd";
import {useNavigate} from "react-router-dom";
import {StationsMapPanel} from "../components/StationsMapPanel";
import {useMovementStore} from "../store";

export function SystemConfigPage() {
  const navigate = useNavigate();
  const {modal, message} = AntdApp.useApp();
  const stationDefinitions = useMovementStore(
    (state) => state.stationDefinitions,
  );
  const teams = useMovementStore((state) => state.teams);
  const totalStations = useMovementStore(
    (state) => state.stationDefinitions.length,
  );
  const deleteStationDefinition = useMovementStore(
    (state) => state.deleteStationDefinition,
  );
  const deleteTeam = useMovementStore((state) => state.deleteTeam);

  return (
    <Tabs
      defaultActiveKey="stations"
      items={[
        {
          key: "stations",
          label: "Station list (" + stationDefinitions.length + ")",
          children: (
            <Flex vertical gap={16} className="full-width">
              <Button
                type="primary"
                onClick={() => navigate("/system-config/stations/new")}>
                Add new Station
              </Button>
              <List
                className="card-list"
                dataSource={stationDefinitions}
                renderItem={(station) => (
                  <List.Item>
                    <Card className="surface-card station-card">
                      <div className="station-row">
                        <Flex vertical gap={4}>
                          <Typography.Title level={4} className="card-title">
                            {station.name}
                          </Typography.Title>
                          <Typography.Text className="muted-copy compact-copy">
                            {station.id}
                          </Typography.Text>
                          <Typography.Text className="muted-copy compact-copy">
                            {station.description}
                          </Typography.Text>
                        </Flex>
                        <Space>
                          <Button
                            icon={<EditOutlined />}
                            onClick={() =>
                              navigate(`/system-config/stations/${station.id}`)
                            }>
                            Edit
                          </Button>
                          <Button
                            danger
                            onClick={() => {
                              modal.confirm({
                                title: "Delete station?",
                                content:
                                  "Tất cả tiến độ theo trạm này sẽ bị xóa khỏi dummy data.",
                                okText: "Delete",
                                cancelText: "Hủy",
                                onOk: () => {
                                  deleteStationDefinition(station.id);
                                  message.success("Đã xóa trạm");
                                },
                              });
                            }}>
                            Delete
                          </Button>
                        </Space>
                      </div>
                    </Card>
                  </List.Item>
                )}
              />
            </Flex>
          ),
        },
        {
          key: "teams",
          label: "Team list (" + teams.length + ")",
          children: (
            <Flex vertical gap={16} className="full-width">
              <Button
                type="primary"
                onClick={() => navigate("/system-config/teams/new")}>
                Add new Team
              </Button>
              <List
                className="card-list"
                dataSource={teams}
                renderItem={(team) => (
                  <List.Item>
                    <Card className="surface-card station-card">
                      <div className="station-row">
                        <Flex vertical gap={4}>
                          <Typography.Title level={4} className="card-title">
                            {team.name}
                          </Typography.Title>
                          <Typography.Text className="muted-copy compact-copy">
                            {team.id} · Score {team.score}
                          </Typography.Text>
                          <Typography.Text className="muted-copy compact-copy">
                            Finish {team.finish}/{totalStations} in{" "}
                            {team.totalTimeMinutes} min
                          </Typography.Text>
                        </Flex>
                        <Space>
                          <Button
                            icon={<EditOutlined />}
                            onClick={() =>
                              navigate(`/system-config/teams/${team.id}`)
                            }>
                            Edit
                          </Button>
                          <Button
                            danger
                            onClick={() => {
                              modal.confirm({
                                title: "Delete team?",
                                content:
                                  "Team và toàn bộ tiến độ trạm của team này sẽ bị xóa.",
                                okText: "Delete",
                                cancelText: "Hủy",
                                onOk: () => {
                                  deleteTeam(team.id);
                                  message.success("Đã xóa team");
                                },
                              });
                            }}>
                            Delete
                          </Button>
                        </Space>
                      </div>
                    </Card>
                  </List.Item>
                )}
              />
            </Flex>
          ),
        },
        {
          key: "map",
          label: "Map",
          children: <StationsMapPanel editable />,
        },
      ]}
    />
  );
}

import {LockOutlined, UserOutlined} from "@ant-design/icons";
import {
  Alert,
  App as AntdApp,
  Badge,
  Button,
  Card,
  Flex,
  Form,
  Input,
  Typography,
} from "antd";
import {useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {useMovementStore} from "../store";

type LoginFormValues = {
  username: string;
  password: string;
};

export function LoginPage() {
  const navigate = useNavigate();
  const login = useMovementStore((state) => state.login);
  const session = useMovementStore((state) => state.session);
  const teams = useMovementStore((state) => state.teams);
  const authAccounts = useMovementStore((state) => state.authAccounts);
  const [form] = Form.useForm<LoginFormValues>();
  const {message} = AntdApp.useApp();

  useEffect(() => {
    if (session) {
      navigate("/stations", {replace: true});
    }
  }, [navigate, session]);

  return (
    <div className="login-screen">
      <Card className="surface-card login-card">
        <Flex vertical gap={18} className="full-width">
          <div>
            <Badge color="#ff7a59" text="Mobile web app demo" />
            <Typography.Title level={2} className="login-title">
              MOVEment 2026
            </Typography.Title>
          </div>

          <Alert
            type="info"
            showIcon
            description={
              <Flex vertical gap={4}>
                <Typography.Text strong>Tài khoản demo</Typography.Text>
                <Typography.Text>
                  Tất cả credential đang được đọc từ `database.json`. Team ví dụ
                  `team01/team01`, tài khoản quản trị mặc định là
                  `admin/admin` và `systemadmin/systemadmin`.
                </Typography.Text>
              </Flex>
            }
          />

          <Form
            form={form}
            layout="vertical"
            onFinish={(values) => {
              const username = values.username.trim();
              const password = values.password.trim();

              const matchedAccount = authAccounts.find(
                (account) =>
                  account.username === username && account.password === password,
              );

              if (matchedAccount) {
                login({username, role: matchedAccount.role, teamId: null});
                message.success(`Đăng nhập ${matchedAccount.role} thành công`);
                navigate("/stations");
                return;
              }

              const matchedTeam = teams.find(
                (team) =>
                  team.username === username && team.password === password,
              );

              if (!matchedTeam) {
                message.error("Sai username hoặc password");
                return;
              }

              login({
                username: matchedTeam.username,
                role: "user",
                teamId: matchedTeam.id,
              });
              message.success("Đăng nhập thành công");
              navigate("/stations");
            }}>
            <Form.Item
              label="Username"
              name="username"
              rules={[
                {required: true, message: "Vui lòng nhập username"},
                {min: 3, message: "Username tối thiểu 3 ký tự"},
              ]}>
              <Input prefix={<UserOutlined />} placeholder="team.lead" />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[
                {required: true, message: "Vui lòng nhập password"},
                {min: 5, message: "Password tối thiểu 5 ký tự"},
              ]}>
              <Input.Password prefix={<LockOutlined />} placeholder="••••••" />
            </Form.Item>

            <Button type="primary" htmlType="submit" block size="large">
              Login
            </Button>
          </Form>
        </Flex>
      </Card>
    </div>
  );
}

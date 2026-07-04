import { App as AntdApp, Button, Card, Form, Input, Switch, Typography } from 'antd'
import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useMovementStore } from '../store'
import type { StationFormValues } from '../types'

export function StationEditorPage() {
  const navigate = useNavigate()
  const params = useParams<{ stationId: string }>()
  const { modal, message } = AntdApp.useApp()
  const stationDefinitions = useMovementStore((state) => state.stationDefinitions)
  const saveStationDefinition = useMovementStore((state) => state.saveStationDefinition)
  const [form] = Form.useForm<StationFormValues>()

  const station = stationDefinitions.find((item) => item.id === params.stationId)
  const isEditing = Boolean(station)

  useEffect(() => {
    if (station) {
      form.setFieldsValue(station)
      return
    }

    form.setFieldsValue({ id: '', name: '', isEnable: true })
  }, [form, station])

  return (
    <Card className="surface-card">
      <Typography.Title level={3} className="section-title">
        {isEditing ? 'Create/Edit Station' : 'Create Station'}
      </Typography.Title>
      <Form
        form={form}
        layout="vertical"
        onFinish={(values) => {
          const duplicate = stationDefinitions.some(
            (item) => item.id === values.id && item.id !== station?.id,
          )

          if (duplicate) {
            message.error('ID trạm đã tồn tại')
            return
          }

          modal.confirm({
            title: isEditing ? 'Cập nhật station?' : 'Tạo station mới?',
            content: 'Danh sách trạm của tất cả team sẽ đồng bộ theo thay đổi này.',
            okText: 'Xác nhận',
            cancelText: 'Hủy',
            onOk: () => {
              saveStationDefinition(values, station?.id)
              message.success(isEditing ? 'Đã cập nhật station' : 'Đã tạo station mới')
              navigate('/system-config')
            },
          })
        }}
      >
        <Form.Item
          label="ID"
          name="id"
          rules={[{ required: true, message: 'Vui lòng nhập id' }]}
        >
          <Input disabled={isEditing} placeholder="ST06" />
        </Form.Item>
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: 'Vui lòng nhập tên trạm' }]}
        >
          <Input placeholder="Mê cung tre" />
        </Form.Item>
        <Form.Item label="isEnable" name="isEnable" valuePropName="checked">
          <Switch />
        </Form.Item>
        <Button type="primary" htmlType="submit" block>
          {isEditing ? 'Update Station Info' : 'Create Station'}
        </Button>
      </Form>
    </Card>
  )
}
import React from 'react'
import { ConfigProvider, Layout, Space, Typography } from 'antd'

import './index.css'

// import theme
import theme from './theme'


function App() {
  const { Header, Footer, Sider, Content } = Layout;
  return (
    <ConfigProvider theme={{ ...theme }}>
      <Space
        direction="vertical"
        style={{
          width: '100%',
          height: '100%',
        }}
        size={[0, 48]}
      >
        <Layout>
          <Header style={{ backgroundColor: theme.token.colorBgLayout }}
          >Header</Header>
          <Content style={{ backgroundColor: theme.token.colorPrimaryBg }}
          >
            <Typography.Title style={{ color: theme.token.colorPrimary }}
            >Content</Typography.Title>
          </Content>
          <Footer>Footer</Footer>
        </Layout>
      </Space>
    </ConfigProvider>
  );
}

export default App;

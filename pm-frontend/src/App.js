import React from 'react'
import { ConfigProvider, Layout, Space } from 'antd'

import './index.css'

// import theme
import theme from './theme'

// import pages
import CategoriesPage from './pages/categories'


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
            <CategoriesPage />
          </Content>
          <Footer>Footer</Footer>
        </Layout>
      </Space>
    </ConfigProvider>
  );
}

export default App;

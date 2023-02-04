import React from 'react'
import { ConfigProvider, Layout, Menu, Typography } from 'antd'
// antd icons
import { AppstoreOutlined, FolderOutlined } from '@ant-design/icons'

// router
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";

import './index.css'

// import theme
import theme from './theme'

// import pages
import CategoriesPage from './pages/categories'
import CategoryPage from './pages/category'

// categories store
import { useCategories } from './pages/categories/store'

function App() {
  const { Header, Footer, Content } = Layout;

  const categories = useCategories()

  // build categories menu items function
  const buildCategoriesMenuItems = (categories) => {
    return categories.map((category) => {
      return {
        label: <Link to={`/categories/${category.id}`}>{category.name}</Link>,
        key: category.id,
        icon: <FolderOutlined />,
        path: `/categories/${category.id}`,
      }
    })
  }

  const menuItems = [
    {
      label:
      <Link to="/"><Typography.Title level={5}>PM</Typography.Title></Link>,
      key: 'home',
      path: '/'
    },
    { label: 'Categories', key: 'categories', icon: <AppstoreOutlined />, children: buildCategoriesMenuItems(categories) },
  ]

  return (
    <ConfigProvider theme={{ ...theme }}>
      <Router>
        <Layout>
          <Header style={{ backgroundColor: theme.token.colorBgLayout }}
          >
            <Menu
              theme="dark"
              mode="horizontal"
              defaultSelectedKeys={['home']}
              style={{ backgroundColor: theme.token.colorBgLayout }}
              items={menuItems}
            />
          </Header>
          <Content style={{ backgroundColor: theme.token.colorPrimaryBg }}
          >
            <Routes>
              <Route path="/categories/:id" element={<CategoryPage />} />
              <Route path="/" element={<CategoriesPage />} />
            </Routes>
          </Content>
          <Footer>Footer</Footer>
        </Layout>
      </Router>
    </ConfigProvider>
  );
}

export default App;

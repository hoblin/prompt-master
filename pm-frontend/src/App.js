import React from 'react'
import {
  ConfigProvider,
  Divider,
  Layout,
  Menu,
  Typography,
  Space,
  Input,
} from 'antd'
// antd icons
import { AppstoreOutlined, FolderOutlined } from '@ant-design/icons'
// font awesome icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter } from '@fortawesome/free-solid-svg-icons';


// router
import {
  Routes,
  Route,
  useNavigate
} from "react-router-dom";

import './index.css'

// import theme
import theme from './theme'

// import layout components
import Filters from './components/filters'
import Search from './components/search'

// import pages
import CategoriesPage from './pages/categories'
import CategoryPage from './pages/category'

// categories store
import { useCategories, useCategoriesStates, useFetchCategories } from './pages/categories/store'

// import function to register Swiper custom elements
import { register } from 'swiper/element/bundle';
// register Swiper custom elements
register();

function App() {
  const { Header, Content } = Layout;

  const categories = useCategories()
  const { isLoading, isLoaded } = useCategoriesStates()
  const fetchCategories = useFetchCategories()
  const navigate = useNavigate()

  React.useEffect(() => {
    if (!isLoading && !isLoaded) {
      fetchCategories()
    }
  }, [isLoading, isLoaded, fetchCategories])

  // build categories menu items function
  const buildCategoriesMenuItems = (categories) => {
    return categories.map((category) => {
      const path = `/categories/${category.id}`
      return {
        label: category.name,
        key: path,
        icon: <FolderOutlined />
      }
    })
  }

  const handleMenuClick = ({ key }) => {
    if (key === 'filters') {
      return
    }
    navigate(key)
  }

  const menuItems = [
    {
      label: <Typography.Title level={5}>PM</Typography.Title>,
      key: '/'
    },
    {
      label: 'Categories', key: '/categories',
      icon: <AppstoreOutlined />,
      children: buildCategoriesMenuItems(categories)
    },
    {
      label: <Filters />,
      key: 'filters',
    }
  ]

  return (
    <ConfigProvider theme={{ ...theme }}>
      <Layout>
        <Header
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: theme.token.colorBgLayout
          }}
        >
          <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={['home']}
            items={menuItems}
            selectedKeys={window.location.pathname}
            onClick={handleMenuClick}
            style={{
              backgroundColor: theme.token.colorBgLayout,
              width: '100%',
            }}
          />
          <Search />
        </Header>
        <Content style={{ backgroundColor: theme.token.colorPrimaryBg }}
        >
          <Routes>
            <Route path="/categories/:id" element={<CategoryPage />} />
            <Route path="/" element={<CategoriesPage />} />
          </Routes>
        </Content>
      </Layout>
    </ConfigProvider>
  );
}

export default App;

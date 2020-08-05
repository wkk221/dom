import Vue from 'vue'
import {
  Button,
  Form,
  FormItem,
  Input,

  Row,
  Col,
  Container,
  Header,
  Aside,
  Main,

  Menu,
  Submenu,
  MenuItem,
  MenuItemGroup,

  BreadcrumbItem,
  Breadcrumb,
  Card,

  Table,
  TableColumn,
  Pagination,
  Switch,
  Tooltip,
  Dialog,
  Tag,
  Tree,
  Select,
  Option,
  Cascader,
  Alert,
  Tabs,
  TabPane,
  Message,
  MessageBox,
  Steps,
  Step,
  CheckboxGroup,
  Checkbox,
  TimelineItem,
  Timeline

} from 'element-ui'

// 组件式调用
Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Tag)
Vue.use(Tabs)
Vue.use(TabPane)

// 布局组件
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Row)
Vue.use(Col)

// 表格组件
Vue.use(Table)
Vue.use(TableColumn)

// 面包屑
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Pagination)
Vue.use(Switch)
Vue.use(Tooltip)
Vue.use(Tree)
Vue.use(Select)
Vue.use(Option)

// 列表导航布局
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(MenuItemGroup)
Vue.use(Dialog)
Vue.use(Cascader) // 级联组件
Vue.use(Alert)
Vue.use(Steps)
Vue.use(Step)
Vue.use(CheckboxGroup)
Vue.use(Checkbox)
Vue.use(TimelineItem)
Vue.use(Timeline)
// API 方式调用
Vue.prototype.$message = Message
Vue.prototype.$messageBox = MessageBox

import { createBrowserRouter } from 'react-router-dom';
import { Login } from '@/pages/login/Login';
import { LoginLayout } from '@/layouts';
import { NaverShoppingSlots } from '@/pages/slots/naver-shopping/NaverShoppingSlots';
import { NaverPlaceSlots } from '@/pages/slots/naver-place/NaverPlaceSlots';
import { NaverPlaceUsers } from '@/pages/users/naver-place/NaverPlaceUsers';
import { NaverShoppingLog } from '@/pages/log/naver-shopping/NaverShoppingLog';
import { NaverPlaceLog } from '@/pages/log/naver-place/NaverPlaceLog';
import { SlotTypeManage } from '@/pages/admin/slot-type-manage/SlotTypeManage';
import { TableHeaderManage } from '@/pages/admin/table-header-manage/TableHeaderManage';
import { NaverShoppingUsers } from '@/pages/users/naver-shopping/NaverShoppingUsers';
import { NaverShoppingRequestManage } from '@/pages/request-manage/naver-shopping/NaverShoppingRequestManage';
import { NaverPlaceRequestManage } from '@/pages/request-manage/naver-place/NaverPlaceRequestManage';
import { SettlementManage } from '@/pages/settlement-manage/SettlementManage';
import { NoticeList } from '@/pages/notice/notice-list/NoticeList';
import { NoticeView } from '@/pages/notice/notice-view/NoticeView';
import { NoticeEdit } from '@/pages/notice/notice-edit/NoticeEdit';
import { NaverShoppingSlotDetail } from '@/pages/slots/detail-page/NaverShoppingSlotDetail';
import { NaverPlaceSlotDetail } from '@/pages/slots/detail-page/NaverPlaceSlotDetail';
import { NaverShoppingUserDetail } from '@/pages/users/detail-page/NaverShoppingUserDetail';
import { NaverPlaceUserDetail } from '@/pages/users/detail-page/NaverPlaceUserDetail';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Login />,
  },
  {
    element: <LoginLayout />,
    loader: LoginLayout.loader,
    children: [
      { path: 'naver-shopping-slots', element: <NaverShoppingSlots /> },
      {
        path: 'naver-shopping-slots-detail',
        element: <NaverShoppingSlotDetail />,
      },
      { path: 'naver-place-slots-detail', element: <NaverPlaceSlotDetail /> },
      { path: 'naver-place-slots', element: <NaverPlaceSlots /> },
      { path: 'naver-shopping-users', element: <NaverShoppingUsers /> },
      { path: 'naver-place-users', element: <NaverPlaceUsers /> },
      {
        path: 'naver-shopping-users-detail',
        element: <NaverShoppingUserDetail />,
      },
      { path: 'naver-place-users-detail', element: <NaverPlaceUserDetail /> },
      {
        path: 'naver-shopping-request-manage',
        element: <NaverShoppingRequestManage />,
      },
      {
        path: 'naver-place-request-manage',
        element: <NaverPlaceRequestManage />,
      },
      { path: 'naver-shopping-log-slots', element: <NaverShoppingLog /> },
      { path: 'naver-place-log-slots', element: <NaverPlaceLog /> },
      { path: 'slot-type-manage', element: <SlotTypeManage /> },
      { path: 'table-header-manage', element: <TableHeaderManage /> },
      { path: 'settlement-manage', element: <SettlementManage /> },
      { path: 'notice/list', element: <NoticeList /> },
      { path: 'notice/view', element: <NoticeView /> },
      { path: 'notice/edit', element: <NoticeEdit /> },
    ],
  },
]);

export default router;

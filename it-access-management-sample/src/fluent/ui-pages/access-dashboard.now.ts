import '@servicenow/sdk/global'
import { UiPage } from '@servicenow/sdk/core'
import accessPage from '../../client/index.html'

UiPage({
    $id: Now.ID['access-management-dashboard'],
    endpoint: 'x_itaccess_dashboard.do',
    description: 'IT Access Management Dashboard UI Page',
    category: 'general',
    html: accessPage,
    direct: true,
})
